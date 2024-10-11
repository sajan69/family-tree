import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../utils/types';
import { ref, get } from 'firebase/database';
import { database } from '../utils/firebase';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';

interface Props {
  onSelect: (memberId: string) => void;
}

const FamilySearch: React.FC<Props> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<FamilyMember[]>([]);
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchAllMembers = async () => {
      const familyRef = ref(database, 'family');
      const snapshot = await get(familyRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const membersArray = Object.entries(data).map(([id, member]) => ({
          id,
          ...(member as FamilyMember),
        }));
        setAllMembers(membersArray);
      }
    };

    fetchAllMembers();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filtered = allMembers.filter(member =>
        `${member.name} ${member.middleName} ${member.lastName}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, allMembers]);

  const handleSelect = (memberId: string) => {
    onSelect(memberId);
    setSearchTerm('');
    setSuggestions([]);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-end sm:items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden p-2 text-gray-600 hover:text-gray-800"
          aria-label="Toggle search"
        >
          <FaSearch size={20} />
        </button>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchFamilyMember')}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
            isExpanded ? 'max-h-12 mt-2' : 'max-h-0 sm:max-h-12'
          } ${isExpanded ? 'opacity-100' : 'opacity-0 sm:opacity-100'} ${
            isExpanded ? 'mb-2' : 'mb-0'
          } overflow-hidden sm:overflow-visible`}
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((member) => (
            <li
              key={member.id}
              onClick={() => handleSelect(member.id)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {`${member.name} ${member.middleName} ${member.lastName}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FamilySearch;