import React from 'react';
import Image from 'next/image';

export default function NoteCard({ title, description, content,imgUrl,givenBy }) {

  const preview = content.length > 100 ? content.slice(0, 100) + '...' : content;

  return (
    <div className="w-80 mx-auto border-2 border-neutral-700 rounded-xl shadow-md overflow-hidden text-white">
      <div className="h-48 w-full object-cover overflow-hidden">
        <Image src={imgUrl} alt="" width={1000} height={1000}></Image>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold ">{title}</h2>
        <p className="mt-2">{description}</p>
        <p className="mt-4 text-gray-500 text-sm">Given by: <span className="font-medium">{givenBy}</span></p>
      </div>
    </div>
  );
}