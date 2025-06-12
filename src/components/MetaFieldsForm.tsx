import React from 'react';



type MetaFields = {
  mainHeading: string;
  subheading: string;
  bodyText: string;
  cta: string;
  logoUrl: string;
  bannerImages: string[];
};


type Props = {
  metaFields: MetaFields;
  onChange: (updatedMeta: MetaFields) => void;
};

export default function MetaFieldsForm({ metaFields, onChange }: Props) {
  const handleChange = (field: keyof MetaFields, value: string) => {
    onChange({ ...metaFields, [field]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Edit Meta Fields</h2>

      <div>
        <label className="block mb-1 font-medium">Main Heading</label>
        <input
          type="text"
          value={metaFields.mainHeading}
          onChange={(e) => handleChange('mainHeading', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Subheading</label>
        <input
          type="text"
          value={metaFields.subheading}
          onChange={(e) => handleChange('subheading', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Body Text</label>
        <input
          type="text"
          value={metaFields.bodyText}
          onChange={(e) => handleChange('bodyText', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">CTA</label>
        <input
          type="text"
          value={metaFields.cta}
          onChange={(e) => handleChange('cta', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Logo URL</label>
        <input
          type="text"
          value={metaFields.logoUrl}
          onChange={(e) => handleChange('logoUrl', e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Banner Images (comma separated)</label>
        <input
          type="text"
          value={metaFields.bannerImages.join(', ')}
          onChange={(e) =>
            onChange({ ...metaFields, bannerImages: e.target.value.split(',').map((img) => img.trim()) })
          }
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
