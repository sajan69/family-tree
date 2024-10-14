import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { FamilyMember } from '../utils/types';
import { useTranslation } from 'react-i18next';
import { DialogTrigger, Button, ModalOverlay, Modal, Dialog, Heading } from 'react-aria-components';
import { FaDownload, FaEdit } from 'react-icons/fa';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../contexts/AuthContext';
import { ref, update } from 'firebase/database';
import { database } from '../utils/firebase';
import { uploadToCloudinary } from '../utils/cloudinaryConfig';
import Swal from 'sweetalert2';

interface EditFormState extends FamilyMember {}

interface Props {
  member: FamilyMember;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHighlighted: boolean;
  onMemberUpdate: (updatedMember: FamilyMember) => void;
}

const FamilyMemberComponent: React.FC<Props> = ({ member, setIsModalOpen, isHighlighted, onMemberUpdate }) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  const pdfRef = useRef<HTMLDivElement>(null);
  const genderClass = member.relation === 'son' ? 'son' : 'daughter';
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormState, setEditFormState] = useState<EditFormState>({ ...member });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    console.log('FamilyMemberComponent rendered');
    console.log('Is user logged in?', isLoggedIn);
    console.log('Is edit modal open?', isEditModalOpen);
    return () => {
      console.log('FamilyMemberComponent unmounted');
    };
  }, [isLoggedIn, isEditModalOpen]);

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
  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    });
  };

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
        showAlert(t('familyMember.pdfGeneratedSuccess'), t('familyMember.pdfGeneratedSuccess'), 'success');
        setError(null);
      } catch (err) {
        console.error('Error generating PDF:', err);
        showAlert(t('familyMember.pdfGenerationError'), t('familyMember.pdfGenerationError'), 'error');
        
        // Fallback: Generate a simple text-based PDF
        try {
          const doc = new jsPDF();
          doc.text(memberInfo, 10, 10);
          doc.save(`${member.name}_${member.lastName}_simple.pdf`);
          showAlert(t('familyMember.pdfGeneratedSuccess'), t('familyMember.pdfGeneratedSuccess'), 'success');
        } catch (fallbackErr) {
          console.error('Fallback PDF generation failed:', fallbackErr);
          showAlert(t('familyMember.pdfGenerationError'), t('familyMember.pdfGenerationError'), 'error');
        }
      }
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let updatedMember = { ...editFormState };

      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            const base64String = reader.result as string;
            const profilePicUrl = await uploadToCloudinary(base64String);
            updatedMember.profilePic = profilePicUrl;

            await updateMemberInDatabase(updatedMember);
            console.log('data:', updatedMember);
            // showToast(t('familyMember.memberUpdatedSuccessfully'), 'success');
          } catch (err) {
            console.error('Error uploading image:', err);
            showAlert(t('familyMember.imageUploadError'), t('familyMember.imageUploadError'), 'error');
          }
        };
        reader.readAsDataURL(imageFile);
      } else {
        await updateMemberInDatabase(updatedMember);
        showAlert(t('familyMember.memberUpdatedSuccessfully'), t('familyMember.memberUpdatedSuccessfully'), 'success');
      }
    } catch (err) {
      console.error('Error updating member:', err);
      showAlert(t('familyMember.memberUpdateError'), t('familyMember.memberUpdateError'), 'error');
    }
  };

  const updateMemberInDatabase = async (updatedMember: FamilyMember) => {
    const memberRef = ref(database, `family/${member.id}`);
    await update(memberRef, updatedMember);
    onMemberUpdate(updatedMember);
    setIsEditModalOpen(false);
    setError(null);
  };

  return (
    <>
    <div className="relative">
      <DialogTrigger>
      <Button className={`family-member ${genderClass} ${isHighlighted ? 'highlighted' : ''} w-full sm:w-auto`}>
          {member.profilePic ? (
            <Image 
              src={member.profilePic}
              alt={member.name} 
              width={100} 
              height={100} 
              priority
              className={`rounded-full ${isHighlighted ? 'ring-4 ring-yellow-400' : ''} mx-auto`}
            />
          ) : (
            <Image
              src="/default_profile_pic.png"
              alt={member.name}
              width={100}
              height={100}
              priority
              className={`rounded-full ${isHighlighted ? 'ring-4 ring-yellow-400' : ''} mx-auto`}
            />
          )}
          <h3 className={`text-sm sm:text-base ${isHighlighted ? 'text-yellow-600 font-bold' : ''}`}>
            {`${member.name} 
              ${member.middleName ? member.middleName : ''} 
              ${member.lastName}`}
          </h3>
          <p className="birth-date text-xs sm:text-sm">
            {`${member.birthDate} - 
              ${member.deathDate ? member.deathDate : t('present')}`}
          </p>
          {member.spouse && (
            <p className="spouse text-xs sm:text-sm">
              ❤️ {member.spouse}
            </p>
          )}
        </Button>
        <ModalOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Modal className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] max-h-[90vh] overflow-y-auto">
            <Dialog>
              {({close}) => (
                <>
                   <div className="flex justify-between items-center mb-4">
                    <Heading slot="title" className="text-xl sm:text-2xl font-bold">
                      {t('familyMember.idCard')}
                    </Heading>
                    <Button onPress={close} className="text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  </div>
                  <div ref={pdfRef} className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2 flex flex-col items-center justify-center sm:border-r sm:border-gray-300 sm:pr-6 mb-4 sm:mb-0">
                      {member.profilePic && (
                        <div className="relative w-48 h-48 mb-4">
                        <Image 
                          src={member.profilePic}
                          alt={member.name} 
                          layout="fill"
                          objectFit="cover"
                          priority
                          className="rounded-full border-4 border-white shadow-lg"
                          />
                        </div>
                      )}
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-center">{`${member.name} ${member.lastName}`}</h2>
                      <p className="text-lg sm:text-xl mb-4 text-gray-600 text-center">
                        {member.relation === 'son' ? t('familyMember.son') : t('familyMember.daughter')} 
                        {member.parentId && ` ${t('familyMember.of')} ${member.parentName}`}
                      </p>
                      <div className="mt-4">
                        <QRCodeSVG value={memberInfo} size={128} level="H" />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2 sm:pl-6">
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
                  {isLoggedIn && (
                     <div className=" flex flex-col items-center">
                    <Button 
                      onPress={() => {
                        
                        close(); // Close the ID card modal
                        setIsEditModalOpen(true);
                      }} 
                      className="mt-4 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 flex items-center transition duration-300"
                    >
                      <FaEdit className="mr-2 inline" />
                      {t('familyMember.editInfo')}
                    </Button>
                    </div>
                  )}
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>

      <DialogTrigger isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <ModalOverlay className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <Modal className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <Dialog>
              {({close}) => (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <Heading slot="title" className="text-2xl font-bold">
                      {t('familyMember.editMemberInfo')}
                    </Heading>
                    <Button onPress={close} className="text-gray-500 hover:text-gray-700">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </Button>
                  </div>
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block mb-1">{t('updateForm.name')}</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={editFormState.name}
                        onChange={handleEditChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="middleName" className="block mb-1">{t('updateForm.middleName')}</label>
                      <input
                        type="text"
                        id="middleName"
                        name="middleName"
                        value={editFormState.middleName || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block mb-1">{t('updateForm.lastName')}</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={editFormState.lastName}
                        onChange={handleEditChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="relation" className="block mb-1">{t('updateForm.relation')}</label>
                      <select
                        id="relation"
                        name="relation"
                        value={editFormState.relation}
                        onChange={handleEditChange}
                        required
                        className="w-full p-2 border rounded"
                      >
                        <option value="son">{t('updateForm.son')}</option>
                        <option value="daughter">{t('updateForm.daughter')}</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contactNumber" className="block mb-1">{t('updateForm.contactNumber')}</label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={editFormState.contactNumber}
                        onChange={handleEditChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block mb-1">{t('updateForm.address')}</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={editFormState.address}
                        onChange={handleEditChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-1">{t('updateForm.email')}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={editFormState.email || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="spouse" className="block mb-1">{t('updateForm.spouse')}</label>
                      <input
                        type="text"
                        id="spouse"
                        name="spouse"
                        value={editFormState.spouse || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="birthDate" className="block mb-1">{t('updateForm.birthDate')}</label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        value={editFormState.birthDate}
                        onChange={handleEditChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="deathDate" className="block mb-1">{t('updateForm.deathDate')}</label>
                      <input
                        type="date"
                        id="deathDate"
                        name="deathDate"
                        value={editFormState.deathDate || ''}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label htmlFor="profilePic" className="block mb-1">{t('updateForm.profilePic')}</label>
                      <input
                        type="file"
                        id="profilePic"
                        name="profilePic"
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full p-2 border rounded"
                      />
                      {editFormState.profilePic && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">{t('updateForm.currentProfilePic')}</p>
                          <Image 
                            src={editFormState.profilePic}
                            alt={member.name} 
                            width={100} 
                            height={100} 
                            
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <Button 
                        type="button" 
                        onPress={() => {
                          close();
                          setEditFormState({ ...member });
                          console.log('Closing edit modal');
                        }}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                      >
                        {t('cancel')}
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                      >
                        {t('save')}
                      </Button>
                    </div>
                  </form>
                  {error && (
                    <p className="text-red-500 mt-2">{error}</p>
                  )}
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </DialogTrigger>
    </div>
      
      </>
  );
}

export default FamilyMemberComponent;