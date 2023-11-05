"use client";
import { addDoc, collection, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query } from "@firebase/firestore";
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { db } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "" });
  const [total, setTotal] = useState(0);

  // CRUD
  // CREATE
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name && newItem.price) {
      setItems([...items, newItem]);
      await addDoc(collection(db, "items"), {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({ name: "", price: "" });
    }
  };

  // READ
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemArr = [];
      let totalPrice = 0;
      QuerySnapshot.forEach((doc) => {
        itemArr.push({ ...doc.data(), id: doc.id });
        totalPrice += parseFloat(doc.data().price);
      });
      setItems(itemArr);
      setTotal(totalPrice);
      return () => unsubscribe();
    });
  }, []);

  // UPDATE
  const updateItem = async id => {
    const selectedItem = items.find(item => item.id === id);

    Swal.fire({
      title: 'Edit Item',
      html:
        `<label>Item</label><input id="itemName" value=${selectedItem.name} class="swal2-input">` +
        `<label>Price</label><input type="number" value=${selectedItem.price} id="itemPrice" class="swal2-input">`,
      focusConfirm: false,
      preConfirm: async () => {
        const itemName = document.getElementById('itemName').value;
        const itemPrice = document.getElementById('itemPrice').value;

        if (itemName && itemPrice) {
          selectedItem.name = itemName;
          selectedItem.price = itemPrice;
          setItems([...items]);

          await updateDoc(doc(db, 'items', id), {
            name: itemName.trim(),
            price: itemPrice,
          });
        } else {
          Swal.showValidationMessage('Preencha ambos os campos!')
        }
      }
    })
  }

  // DELETE
  const deleteItem = async id => {
    await deleteDoc(doc(db, 'items', id))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border"
              type="text"
              placeholder="Enter a item"
            />
            <input
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="col-span-2 p-3 border mx-3"
              type="number"
              placeholder="Enter $"
            />
            <button
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
              type="submit"
            >
              +
            </button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li
                key={id}
                className="my-4 w-full rounded flex justify-between bg-slate-950"
              >
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>${item.price}</span>
                </div>
                <div className="flex">
                  <button
                    onClick={() => updateItem(item.id)}
                    className="mx-1 rounded bg-orange-500 hover:bg-orange-600 w-16"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="mx-1 rounded bg-red-500 hover:bg-red-600 w-16"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            ""
          ) : (
            <div className="flex justify-between p-4">
              <span>Total</span>
              <span>${total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
