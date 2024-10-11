import React, { useState, useEffect } from 'react';
import { ref, push, set, onValue } from 'firebase/database';
import { database } from '../utils/firebase';
import { FamilyMember } from '../utils/types';
import { useTranslation } from 'react-i18next';
import { uploadToCloudinary } from '../utils/cloudinaryConfig';
import { useRouter } from 'next/navigation';

const UpdateForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    lastName: 'Adhikari',
  });
  const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }

    const familyRef = ref(database, 'family');
    onValue(familyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const members = Object.values(data) as FamilyMember[];
        setAllMembers(members);
      }
    });
  }, [router]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'parentId') {
      const selectedParent = allMembers.find(member => member.id === value);
      if (selectedParent) {
        setFormData(prev => ({
          ...prev,
          parentId: value,
          parentName: `${selectedParent.name} ${selectedParent.lastName}`
        }));
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parentMember = allMembers.find(member => member.id === formData.parentId);
    const newGeneration = parentMember ? parentMember.generation + 1 : 0;
    
    const newMemberData: Partial<FamilyMember> = {
      ...formData,
      generation: newGeneration,
    };
  
    if (imageFile) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          const profilePicUrl = await uploadToCloudinary(base64String);
          newMemberData.profilePic = profilePicUrl;

          const newMemberRef = push(ref(database, 'family'));
          await set(newMemberRef, {
            ...newMemberData,
            id: newMemberRef.key,
          });

          setFormData({ lastName: 'Adhikari' });
          setImageFile(null);
        };
        reader.readAsDataURL(imageFile);
      } catch (error) {
        console.error('Failed to upload image:', error);
        // Handle the error appropriately (e.g., show an error message to the user)
      }
    } else {
      const newMemberRef = push(ref(database, 'family'));
      await set(newMemberRef, {
        ...newMemberData,
        id: newMemberRef.key,
      });

      setFormData({ lastName: 'Adhikari' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="parentId" className="block mb-2">{t('updateForm.parent')}</label>
        <select
          id="parentId"
          name="parentId"
          onChange={handleInputChange}
          value={formData.parentId || ''}
          className="w-full p-2 border rounded"
        >
          <option value="">{t('updateForm.selectParent')}</option>
          {allMembers.map(member => (
            <option key={member.id} value={member.id}>
              {`${member.name} ${member.lastName}`}
            </option>
          ))}
        </select>
      </div>
      {formData.parentName && (
        <div className="mb-4">
          <label className="block mb-2">{t('updateForm.selectedParent')}</label>
          <p className="p-2 bg-gray-100 rounded">{formData.parentName}</p>
        </div>
      )}
  
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">{t('updateForm.name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="middleName" className="block mb-2">{t('updateForm.middleName')}</label>
        <input
          type="text"
          id="middleName"
          name="middleName"
          value={formData.middleName || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="lastName" className="block mb-2">{t('updateForm.lastName')}</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="relation" className="block mb-2">{t('updateForm.relation')}</label>
        <select
          id="relation"
          name="relation"
          value={formData.relation || ''}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">{t('updateForm.selectRelation')}</option>
          <option value="son">{t('updateForm.son')}</option>
          <option value="daughter">{t('updateForm.daughter')}</option>
        </select>
      </div>
  
      <div className="mb-4">
        <label htmlFor="contactNumber" className="block mb-2">{t('updateForm.contactNumber')}</label>
        <input
          type="tel"
          id="contactNumber"
          name="contactNumber"
          value={formData.contactNumber || ''}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="address" className="block mb-2">{t('updateForm.address')}</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">{t('updateForm.email')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="spouse" className="block mb-2">{t('updateForm.spouse')}</label>
        <input
          type="text"
          id="spouse"
          name="spouse"
          value={formData.spouse || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="birthDate" className="block mb-2">{t('updateForm.birthDate')}</label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate || ''}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="deathDate" className="block mb-2">{t('updateForm.deathDate')}</label>
        <input
          type="date"
          id="deathDate"
          name="deathDate"
          value={formData.deathDate || ''}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
  
      <div className="mb-4">
        <label htmlFor="profilePic" className="block mb-2">{t('updateForm.profilePic')}</label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          onChange={handleImageChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
      </div>
  
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">
        {t('updateForm.addMember')}
      </button>
    </form>
  );
};

export default UpdateForm;