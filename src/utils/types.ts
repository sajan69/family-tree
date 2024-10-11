export interface FamilyMember {
    parentRelation: string;
    id: string;
    generation: number;
    parentId?: string;
    parentName?: string; // Add this field
    relation: 'son' | 'daughter';
    name: string;
    middleName?: string;
    lastName: string;
    contactNumber: string;
    address: string;
    email?: string;
    spouse?: string;
    birthDate: string;
    deathDate?: string;
    profilePic?: string;
  }

  export interface User {
    id: string;
    username: string;
    password: string;
  }