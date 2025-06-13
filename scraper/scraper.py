import sys
import json
from playwright.sync_api import sync_playwright, TimeoutError
from urllib.parse import urljoin
import re

def get_brand_colors(page):
    colors = page.evaluate('''() => {
        const prominent_elements = Array.from(document.querySelectorAll('body, header, a, button'));
        const color_counts = {};
        const add_color = (color) => {
            if (color && !color.startsWith('rgba(0, 0, 0, 0)')) {
                color_counts[color] = (color_counts[color] || 0) + 1;
            }
        };
        prominent_elements.forEach(el => {
            const style = window.getComputedStyle(el);
            add_color(style.backgroundColor);
            add_color(style.color);
        });
        return Object.entries(color_counts).sort(([,a],[,b]) => b-a).slice(0, 5).map(([color]) => color);
    }''')
    return colors

def scrape_website(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, timeout=60000)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            viewport={'width': 1920, 'height': 1080},
            java_script_enabled=True
        )
        page = context.new_page()
        
        try:
            page.set_default_timeout(45000)
            page.add_init_script("delete navigator.__proto__.webdriver;")
            
            # Wait for the network to be mostly idle, which is better for single-page apps
            print(f"Navigating to {url}...", file=sys.stderr)
            page.goto(url, wait_until="networkidle", timeout=45000)
            print("Navigation completed, page settling...", file=sys.stderr)
            
            # Give the page a few extra seconds for any lazy-loaded content
            page.wait_for_timeout(3000)

            print("Extracting content...", file=sys.stderr)
            headings = page.evaluate('''() => 
                Array.from(document.querySelectorAll('h1, h2, h3'))
                    .filter(el => el.offsetParent !== null && el.textContent.trim().length > 5)
                    .slice(0, 5)
                    .map(el => el.textContent.trim())
            ''')
            
            logo = page.evaluate('''() => {
                const svgLogo = document.querySelector('header a[href="/"] svg, header svg, [aria-label*="logo" i] svg');
                if (svgLogo) return svgLogo.outerHTML;
                const imgLogo = document.querySelector('header img, img[alt*="logo" i], img[class*="logo" i]');
                if (imgLogo && imgLogo.src) return new URL(imgLogo.src, document.baseURI).href;
                return null;
            }''')

            # ** Improved Image Scraping Logic **
            images = page.evaluate('''() => {
                const imageSrcs = new Set();
                
                // 1. Get standard <img> tags
                document.querySelectorAll('img[src]').forEach(img => {
                    if (img.width > 150 && img.height > 150 && img.offsetParent !== null) {
                       try {
                           const url = new URL(img.src, document.baseURI).href;
                           imageSrcs.add(url);
                       } catch (e) { /* ignore invalid URLs */ }
                    }
                });

                // 2. Get CSS background-images from divs
                document.querySelectorAll('div, section, header').forEach(el => {
                    const style = window.getComputedStyle(el);
                    const bgImage = style.backgroundImage;
                    if (bgImage && bgImage.startsWith('url("')) {
                        const urlMatch = bgImage.match(/url\\("?([^"]+)"?\\)/);
                        if (urlMatch && urlMatch[1]) {
                             try {
                                const url = new URL(urlMatch[1], document.baseURI).href;
                                imageSrcs.add(url);
                            } catch (e) { /* ignore invalid URLs */ }
                        }
                    }
                });

                return Array.from(imageSrcs).slice(0, 15);
            }''')
            
            brand_colors = get_brand_colors(page)

            print(f"Found {len(headings)}h, {len(images)}img, {len(brand_colors)}c", file=sys.stderr)
            
            result = {
                "headings": headings or [], "images": images or [], "logo": logo, "brandColors": brand_colors or []
            }
            print(json.dumps(result))
            
        except Exception as e:
            error_msg = f"Scraping failed: {str(e)}"
            print(error_msg, file=sys.stderr)
            result = {"error": error_msg, "brandColors": [], "images": [], "headings": [], "logo": null}
            print(json.dumps(result))
        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        scrape_website(sys.argv[1])
    else:
        print(json.dumps({"error": "URL argument is required"}))
