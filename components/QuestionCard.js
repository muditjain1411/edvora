import React from 'react';

export default function QuestionCard({
    question,
    userName,
    userIcon,
    
}) {
    return (
        <div className="w-[80vw] m-auto mt-4 border-neutral-700 border-2 rounded-lg shadow-md p-6 flex flex-col justify-between">
            {/* Question */}
            <div className="text-xl font-semibold text-white mb-6 flex-grow overflow-auto">
                {question}
            </div>

            
            <div className="flex items-center justify-between border-t pt-4">
                {/* User info */}
                <div className="flex items-center space-x-3">
                    <img
                        src={userIcon}
                        alt={`${userName} icon`}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-white">{userName}</span>
                </div>
            </div>
        </div>
    );
}