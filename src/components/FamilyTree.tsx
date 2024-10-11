import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { ref as databaseRef, onValue } from 'firebase/database';
import { database } from '../utils/firebase';
import FamilyMemberComponent from './FamilyMember';
import { FamilyMember } from '../utils/types';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface FamilyTreeProps {
  
}

interface FamilyTreeRef {
  scrollToMember: (memberId: string) => void;
}

const FamilyTree = forwardRef<FamilyTreeRef, FamilyTreeProps>((props, ref) => {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null);
  
  useEffect(() => {
    const familyRef = databaseRef(database, 'family');
    onValue(familyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const membersArray = Object.entries(data).map((member) => ({
          ...(member[1] as FamilyMember)
        }));
        setFamilyData(membersArray);
      }
    });
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToMember: (memberId: string) => {
      const memberElement = document.getElementById(`family-member-${memberId}`);
      if (memberElement) {
        memberElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedMemberId(memberId);
        
        // Find the member's photo element
        const photoElement = memberElement.querySelector('img') || memberElement.querySelector('.placeholder-image');
        
        if (photoElement) {
          // Add a temporary highlight effect to the photo
          photoElement.style.transition = 'all 0.3s';
          photoElement.style.boxShadow = '0 0 0 4px #fbbf24, 0 0 20px 4px rgba(251, 191, 36, 0.5)';
          
          // Remove the highlight effect after a short delay
          setTimeout(() => {
            photoElement.style.boxShadow = '';
            setHighlightedMemberId(null);
          }, 2000);
        } else {
          // If no photo element found, just remove highlight after delay
          setTimeout(() => {
            setHighlightedMemberId(null);
          }, 2000);
        }
      }
    }
  }));

  const handleZoom = (delta: number) => {
    setZoom(prevZoom => Math.max(0.5, Math.min(2, prevZoom + delta)));
  };

  const renderFamilyTree = (members: FamilyMember[]) => {
    const rootMembers = members.filter(member => !members.some(m => m.id === member.parentId));
    
    if (rootMembers.length === 0) {
      return null;
    }
  
    const renderMember = (member: FamilyMember) => {
      const children = familyData.filter(m => m.parentId === member.id);
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
    <div className="family-tree-container">
      <div 
        className="tree"
        style={{
          transform: `scale(${zoom})`,
          transition: 'transform 0.3s ease-out'
        }}
        ref={(el) => {
          if (el) {
            const containerWidth = el.offsetWidth;
            const treeWidth = el.scrollWidth;
            const containerHeight = el.offsetHeight;
            const treeHeight = el.scrollHeight;
            const horizontalZoom = containerWidth / treeWidth;
            const verticalZoom = containerHeight / treeHeight;
            const initialZoom = Math.min(horizontalZoom, verticalZoom, 1);
            setZoom(initialZoom);
          }
        }}
      >
        {renderFamilyTree(familyData)}
      </div>
      <div className={`zoom-controls ${isModalOpen ? 'hidden' : ''}`}>
        <button onClick={() => handleZoom(0.1)} aria-label="Zoom in">
          <FaPlus />
        </button>
        <button onClick={() => handleZoom(-0.1)} aria-label="Zoom out">
          <FaMinus />
        </button>
      </div>
    </div>
  );
});

export default FamilyTree;