import React, { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { ref as databaseRef, onValue } from 'firebase/database';
import { database } from '../utils/firebase';
import FamilyMemberComponent from './FamilyMember';
import { FamilyMember } from '../utils/types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

interface FamilyTreeProps {
  // Add any props if needed
}

interface FamilyTreeRef {
  scrollToMember: (memberId: string) => void;
}

const FamilyTree = forwardRef<FamilyTreeRef, FamilyTreeProps>((props, ref) => {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [initialZoomSet, setInitialZoomSet] = useState(false);
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const familyRef = databaseRef(database, 'family');
    onValue(familyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const membersArray = Object.entries(data).map(([id, member]) => ({
          id,
          ...(member as FamilyMember)
        }));
        setFamilyData(membersArray);
      }
    });
  }, []);

  const calculateInitialZoom = useCallback(() => {
    const container = document.querySelector('.family-tree-container');
    const tree = document.querySelector('.tree');
    if (container && tree) {
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const treeWidth = tree.scrollWidth;
      const treeHeight = tree.scrollHeight;
      
      const widthRatio = containerWidth / treeWidth;
      const heightRatio = containerHeight / treeHeight;
      
      const newZoom = Math.min(widthRatio, heightRatio, 1);
      setZoom(newZoom);
      setInitialZoomSet(true);
    }
  }, []);

  useEffect(() => {
    if (familyData.length > 0 && !initialZoomSet) {
      requestAnimationFrame(() => {
        calculateInitialZoom();
      });
    }
  }, [familyData, initialZoomSet, calculateInitialZoom]);

  useImperativeHandle(ref, () => ({
    scrollToMember: (memberId: string) => {
      const memberElement = document.getElementById(`family-member-${memberId}`);
      const container = document.querySelector('.family-tree-container');
      if (memberElement && container) {
        // Set a higher zoom level for focusing on the searched member
        const focusZoom = 0.8; // Adjust this value as needed
        setZoom(focusZoom);
  
        // Wait for the zoom to be applied
        setTimeout(() => {
          const containerRect = container.getBoundingClientRect();
          const memberRect = memberElement.getBoundingClientRect();
  
          // Calculate the scroll position to center the member
          const scrollLeft = memberRect.left + memberRect.width / 2 - containerRect.width / 2;
          const scrollTop = memberRect.top + memberRect.height / 2 - containerRect.height / 2;
  
          // Scroll to the calculated position
          container.scrollTo({
            left: container.scrollLeft + scrollLeft,
            top: container.scrollTop + scrollTop,
            behavior: 'smooth'
          });
  
          setHighlightedMemberId(memberId);
          
          const photoElement = memberElement.querySelector('img') || memberElement.querySelector('.placeholder-image');
          
          if (photoElement) {
            photoElement.style.transition = 'all 0.3s';
            photoElement.style.boxShadow = '0 0 0 4px #fbbf24, 0 0 20px 4px rgba(251, 191, 36, 0.5)';
            
            setTimeout(() => {
              photoElement.style.boxShadow = '';
              setHighlightedMemberId(null);
              // Optionally, zoom back out after a delay
              // setTimeout(() => setZoom(1), 3000);
            }, 2000);
          } else {
            setTimeout(() => {
              setHighlightedMemberId(null);
              // Optionally, zoom back out after a delay
              // setTimeout(() => setZoom(1), 3000);
            }, 2000);
          }
        }, 300); // Wait for zoom transition to complete
      }
    }
  }));

  const handleZoom = useCallback((delta: number) => {
    setZoom(prevZoom => Math.max(0.1, Math.min(2, prevZoom + delta)));
  }, []);

  const renderFamilyTree = (members: FamilyMember[]) => {
    const rootMembers = members.filter(member => !member.parentId);
    
    if (rootMembers.length === 0) {
      return null;
    }
  
    const renderMember = (member: FamilyMember) => {
      const children = members.filter(m => m.parentId === member.id);
      return (
        <li key={member.id} id={`family-member-${member.id}`}>
          <div className="flex flex-col items-center">
            <FamilyMemberComponent 
              member={member} 
              setIsModalOpen={setIsModalOpen}
              isHighlighted={highlightedMemberId === member.id}
            />
            {children.length > 0 && (
              <ul className="flex flex-row justify-center">
                {children.map(renderMember)}
              </ul>
            )}
          </div>
        </li>
      );
    };
  
    return (
      <ul className="flex flex-row justify-center">
        {rootMembers.map(renderMember)}
      </ul>
    );
  };

  return (
    <div className="family-tree-container w-full h-full relative">
      <div 
        className="tree absolute top-0 left-0 min-w-full min-h-full"
        style={{
          transform: initialZoomSet ? `scale(${zoom})` : 'none',
          transformOrigin: 'top left',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {renderFamilyTree(familyData)}
      </div>
      <div className={`zoom-controls ${isModalOpen ? 'hidden' : ''} fixed bottom-4 right-4 flex flex-col`}>
        <button 
          onClick={() => handleZoom(0.1)} 
          aria-label={t('zoomIn')}
          className="bg-blue-500 text-white p-2 rounded-full shadow-md mb-2 hover:bg-blue-600 transition-colors duration-200"
        >
          <FaPlus />
        </button>
        <button 
          onClick={() => handleZoom(-0.1)} 
          aria-label={t('zoomOut')}
          className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors duration-200"
        >
          <FaMinus />
        </button>
      </div>
    </div>
  );
});

export default FamilyTree;