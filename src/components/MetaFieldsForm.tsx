// src/components/MetaFieldsForm.tsx
import React from 'react';
import { MetaFields } from '../app/types';

const MetaFieldsForm: React.FC<{ metaFields: MetaFields; onChange: (updatedMeta: MetaFields) => void; }> = ({ metaFields, onChange }) => {
  if (!metaFields) return null;
  const handleChange = (field: keyof MetaFields, value: string | string[]) => {
    onChange({ ...metaFields, [field]: value });
  };
  return (
    <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Content</h2>
        <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Main Heading</label>
            <input type="text" value={metaFields.mainHeading} onChange={(e) => handleChange('mainHeading', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
        </div>
        <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Subheading</label>
            <input type="text" value={metaFields.subheading} onChange={(e) => handleChange('subheading', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
        </div>
        <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">CTA Text</label>
            <input type="text" value={metaFields.cta} onChange={(e) => handleChange('cta', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
        </div>
        <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Logo URL or SVG</label>
            <textarea value={metaFields.logoUrl} onChange={(e) => handleChange('logoUrl', e.target.value)} className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" rows={3}/>
        </div>
    </div>
  );
};

export default MetaFieldsForm;
