'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar = ({ onSearch, navigateOnSearch = false, placeholder = 'Search questions...', value = '', onChange, isControlled = false }) => {
    const [localQuery, setLocalQuery] = useState(value || '');
    const router = useRouter();

    const query = isControlled ? value : localQuery;
    const setQuery = isControlled ? onChange : setLocalQuery;

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            if (isControlled && onSearch) {
                onSearch('');
            }
            return;
        }

        if (navigateOnSearch) {
            router.push(`/questions?search=${encodeURIComponent(trimmedQuery)}`);
        } else if (onSearch) {
            onSearch(trimmedQuery);
        }
    };
    const handleClear = () => {
        setQuery('');
        if (isControlled && onSearch) {
            onSearch(''); // Triggers URL push to /questions
        } else if (navigateOnSearch) {
            router.push('/questions');
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-[400px] pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
            {query && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </form>
    );
};

export default SearchBar;