import firebaseConfig from "../../firebase-config";
import { collection, getDocs, getFirestore, query } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getProducts = async () => {
    let collectionRef = collection(db, "products");
    let q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    let listProducts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      productName: doc.data().product_name,
      measurementUnit: doc.data().measurement_unit,
      price: doc.data().price,
    }));
    return listProducts
  }
export { getProducts };