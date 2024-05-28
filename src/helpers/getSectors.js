import { collection, getDocs, orderBy, query, where  } from 'firebase/firestore'
import { db } from './getFirebase';

export async function getSectors(group){
    const collectionRef = collection(db, 'groups', group, 'sectors');
    const q = query(collectionRef, orderBy('sector_name', 'asc'))

    let sectors = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let objSector = {}
      objSector.sector_name = doc.data().sector_name
      objSector.sector_description = doc.data().sector_description
      sectors.push(objSector)
    });
    return sectors
}