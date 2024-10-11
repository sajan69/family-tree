import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FamilyMember } from '../utils/types';
import { useTranslation } from 'react-i18next';
import { DialogTrigger, Button, ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components';
import { FaDownload } from 'react-icons/fa';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

interface Props {
  member: FamilyMember;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHighlighted: boolean;
}

const FamilyMemberComponent: React.FC<Props> = ({ member, setIsModalOpen, isHighlighted }) => {
  const { t } = useTranslation();
  const pdfRef = useRef<HTMLDivElement>(null);
  const genderClass = member.relation === 'son' ? 'son' : 'daughter';
  const [error, setError] = useState<string | null>(null);

  const memberInfo = `
    Name: ${member.name} ${member.middleName || ''} ${member.lastName}
    Relation: ${member.relation}
    Birth Date: ${member.birthDate}
    ${member.deathDate ? `Death Date: ${member.deathDate}` : ''}
    ${member.spouse ? `Spouse: ${member.spouse}` : ''}
    Contact: ${member.contactNumber}
    Address: ${member.address}
    ${member.email ? `Email: ${member.email}` : ''}
  `;

  const generatePDF = async () => {
    if (pdfRef.current) {
      try {
        const pdfContent = pdfRef.current;
        const canvas = await toPng(pdfContent, { 
          quality: 0.95,
          canvasWidth: 1000,
          canvasHeight: 600,
          pixelRatio: 2
        });
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [210, 297]
        });

        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (600 * imgWidth) / 1000;

        doc.addImage(canvas, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`${member.name}_${member.lastName}_ID.pdf`);
        setError(null);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setError('Failed to generate PDF. Please try again.');
        
        // Fallback: Generate a simple text-based PDF
        try {
          const doc = new jsPDF();
          doc.text(memberInfo, 10, 10);
          doc.save(`${member.name}_${member.lastName}_simple.pdf`);
          setError('Generated a simple text-based PDF as a fallback.');
        } catch (fallbackErr) {
          console.error('Fallback PDF generation failed:', fallbackErr);
          setError('Failed to generate any PDF. Please try again later.');
        }
      }
    }
  };

  return (
    <div className="relative">
      <DialogTrigger>
        <Button className={`family-member ${genderClass} ${isHighlighted ? 'highlighted' : ''}`}>
          {member.profilePic ? (
            <Image 
              src={member.profilePic}
              alt={member.name} 
              width={100} 
              height={100} 
              priority
              className={`rounded-full ${isHighlighted ? 'ring-4 ring-yellow-400' : ''}`}
            />
          ) : (
            <div className={`placeholder-image ${isHighlighted ? 'ring-4 ring-yellow-400' : ''}`}></div>
          )}
          <h3 className={isHighlighted ? 'text-yellow-600 font-bold' : ''}>
            {`${member.name} 
              ${member.middleName ? member.middleName : ''} 
              ${member.lastName}`}
          </h3>
          <p className="birth-date">
            {`${member.birthDate} - 
              ${member.deathDate ? member.deathDate : t('present')}`}
          </p>
          {member.spouse && (
            <p className="spouse">
              ❤️ {member.spouse}
            </p>
          )}
        </Button>
        <ModalOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Modal className="bg-white p-6 rounded-lg shadow-xl w-[1050px] max-h-[110vh] overflow-y-auto">
            <Dialog>
              {({close}) => (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <Heading slot="title" className="text-2xl font-bold">
                      {t('familyMember.idCard')}
                    </Heading>
                    <Button onPress={close} className="text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  </div>
                  <div ref={pdfRef} className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg flex" style={{width: '1000px', height: '600px'}}>
                    <div className="w-1/2 flex flex-col items-center justify-center border-r border-gray-300 pr-6">
                      {member.profilePic && (
                        <Image 
                          src={member.profilePic}
                          alt={member.name} 
                          width={200} 
                          height={200} 
                          priority
                          className="rounded-full mb-4 border-4 border-white shadow-lg"
                        />
                      )}
                      <h2 className="text-3xl font-bold mb-2">{`${member.name} ${member.lastName}`}</h2>
                      <p className="text-xl mb-4 text-gray-600">
                        {member.relation === 'son' ? t('familyMember.son') : t('familyMember.daughter')} 
                        {member.parentId && ` ${t('familyMember.of')} ${member.parentName}`}
                      </p>
                      <div className="mt-4">
                        <QRCodeSVG value={memberInfo} size={128} level="H" />
                      </div>
                    </div>
                    <div className="w-1/2 pl-6">
                      <h3 className="text-xl font-semibold mb-3">{t('familyMember.personalInfo')}</h3>
                      <p><strong>{t('familyMember.birthDate')}:</strong> {member.birthDate} - {member.deathDate ? member.deathDate : t('present')}</p>
                      {member.spouse ? (
                        <p><strong>{t('familyMember.spouse')}:</strong> {member.spouse}</p>
                      ) : (
                        <p><strong>{t('familyMember.maritalStatus')}:</strong> {t('familyMember.notMarried')}</p>
                      )}
                      <p><strong>{t('familyMember.contactNumber')}:</strong> {member.contactNumber}</p>
                      <p><strong>{t('familyMember.address')}:</strong> {member.address}</p>
                      {member.email && <p><strong>{t('familyMember.email')}:</strong> {member.email}</p>}
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col items-center">
                    <Button onPress={generatePDF} className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 flex items-center transition duration-300">
                      <FaDownload className="mr-2" /> {t('familyMember.downloadIDCard')}
                    </Button>
                    {error && (
                      <p className="text-red-500 mt-2">{error}</p>
                    )}
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
  );
};

export default FamilyMemberComponent;