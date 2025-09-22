import React from 'react';
import Image from 'next/image';


export default function NoteCard({ title, description, pdfUrl, givenBy }) {
  return (
    
    <div className="w-80 mx-auto border-2 border-neutral-700 rounded-xl shadow-md overflow-hidden text-white">
      <div className="h-48 w-full object-cover overflow-hidden relative">
        <iframe scrolling="no" src={pdfUrl} className='w-full h-full absolute top-0 left-0 border-none overflow-hidden' ></iframe>
</div>
      <div className="p-6">
        <h2 className="text-xl font-semibold ">{title}</h2>
        <p className="mt-2">{description}</p>
        <p className="mt-4 text-gray-500 text-sm">Given by: <span className="font-medium">{givenBy}</span></p>
      </div>
    </div>
  );
}