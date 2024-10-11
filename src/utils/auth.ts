import { ref, get, set, push } from 'firebase/database';
import { database } from './firebase';
import { User } from './types';

export async function registerUser(username: string, password: string): Promise<User | null> {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  const users = snapshot.val() || {};

  if (Object.values(users).some((user: User) => user.username === username)) {
    return null; // Username already exists
  }

  const newUserRef = push(usersRef);
  const newUser: User = { id: newUserRef.key!, username, password };
  await set(newUserRef, newUser);
  return newUser;
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  const usersRef = ref(database, 'users');
  const snapshot = await get(usersRef);
  const users = snapshot.val() || {};

  const user = Object.values(users).find((user: User) => user.username === username && user.password === password);
  return user || null;
}