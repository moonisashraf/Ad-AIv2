import sys
import json
from playwright.sync_api import sync_playwright, TimeoutError
from urllib.parse import urljoin

def scrape_website(url):
    with sync_playwright() as p:
        # Launch browser with more options
        browser = p.chromium.launch(
            headless=True,
            timeout=30000,  # Increased browser launch timeout
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox'
            ]
        )
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            viewport={'width': 1920, 'height': 1080},
            java_script_enabled=True
        )
        page = context.new_page()
        
        try:
            # Set longer navigation timeout
            page.set_default_timeout(30000)
            
            # Bypass common anti-bot protections
            page.add_init_script("""
                delete navigator.__proto__.webdriver;
                window.navigator.chrome = { runtime: {} };
                Object.defineProperty(navigator, 'languages', {
                    get: () => ['en-US', 'en']
                });
            """)

            # Navigate with multiple wait strategies
            print(f"Navigating to {url}...", file=sys.stderr)  # Debug log
            page.goto(
                url,
                wait_until="domcontentloaded",  # Less strict than networkidle
                timeout=30000
            )
            print("Navigation completed", file=sys.stderr)  # Debug log

            # Wait for critical elements or body to be visible
            page.wait_for_selector('body', state='visible', timeout=10000)
            
            # Handle cookie consent more robustly
            try:
                page.click('button:has-text("Accept"), button:has-text("Agree"), button:has-text("OK")', timeout=5000)
                print("Cookie consent handled", file=sys.stderr)  # Debug log
            except:
                print("No cookie consent found", file=sys.stderr)  # Debug log

            # Wait for logos or header to load
            page.wait_for_timeout(3000)  # Wait 3 seconds to let late-loading assets appear

            # Add artificial delay to let page settle
            page.wait_for_timeout(2000)

            # Extract content with better selectors
            print("Extracting content...", file=sys.stderr)  # Debug log
            headings = page.evaluate('''() => {
                // Prioritize visible headings in main content area
                const main = document.querySelector('main') || document.body;
                return Array.from(main.querySelectorAll('h1, h2, h3'))
                    .filter(el => el.offsetParent !== null)  // Only visible elements
                    .slice(0, 5)
                    .map(el => el.textContent.trim());
            }''')
            
            # Extract Logo (supports img and SVG)
            logo = page.evaluate('''() => {
                // Check for logo IMG first
                const logoSelectors = [
                    'img[alt*="logo" i]',
                    'img[class*="logo" i]',
                    'header img',
                    'nav img'
                ];

                for (const selector of logoSelectors) {
                    const img = document.querySelector(selector);
                    if (img && img.src) {
                        return img.src.startsWith('//') ? 'https:' + img.src : img.src;
                    }
                }

                // If no img logo found, look for SVG logo
                const svgLogo = document.querySelector('header svg, nav svg, svg[aria-label*="logo" i]');
                if (svgLogo) {
                    return 'svg-logo'; // You can handle this separately in frontend
                }

                return null;
            }''')

            # Get other images (excluding the logo)
            images = page.evaluate('''() => {
                // Get visible images with size filtering
                return Array.from(document.querySelectorAll('img[src]'))
                    .filter(img => {
                        const rect = img.getBoundingClientRect();
                        return rect.width > 100 && rect.height > 100;
                    })
                    .slice(0, 10)
                    .map(img => {
                        const src = img.src;
                        try {
                            return new URL(src).href;
                        } catch {
                            return src.startsWith('//') ? 'https:' + src : src;
                        }
                    })
                    .filter(url => url);
            }''')

            print(f"Found {len(headings)} headings and {len(images)} images", file=sys.stderr)  # Debug log
            
            result = {
                "headings": headings or [],
                "paragraphs": [],  # Removed paragraphs as LG uses minimal text
                "images": images or [],
                "logo": logo
            }
            
            # Ensure we output valid JSON
            print(json.dumps(result))
            return result
            
        except TimeoutError:
            error_msg = "Timeout occurred during scraping"
            print(error_msg, file=sys.stderr)  # Debug log
            result = {
                "error": error_msg,
                "headings": ["Timeout occurred - partial results"],
                "images": [],
                "logo": None
            }
            print(json.dumps(result))
            return result
            
        except Exception as e:
            error_msg = f"Scraping failed: {str(e)}"
            print(error_msg, file=sys.stderr)  # Debug log
            result = {"error": error_msg}
            print(json.dumps(result))
            return result
            
        finally:
            try:
                context.close()
                browser.close()
            except:
                pass

if __name__ == "__main__":
    if len(sys.argv) < 2:
        result = {"error": "URL argument is required"}
        print(json.dumps(result))
    else:
        result = scrape_website(sys.argv[1])
        # The result is already printed in the scrape_website function