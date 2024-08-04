'use client';
import React, { useEffect, useState } from 'react';
import Card from 'components/card';
import { firestore } from "../../../../firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

type RowObj = {
    id?: string;
    name: string;
    quantity: number;
    date: string;
};

const columnHelper = createColumnHelper<RowObj>();

function CheckTable() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [data, setData] = useState<RowObj[]>([]);
    const [newItem, setNewItem] = useState<RowObj>({
        name: '',
        quantity: 0,
        date: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(firestore, 'inventory'));
        const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, name:doc.data().name, quantity: doc.data().quantity, date: doc.data().date }));
        setData(fetchedData);
    };

    const addItem = async () => {
        try {
            await addDoc(collection(firestore, 'inventory'), {
                name: newItem.name,
                quantity: newItem.quantity,
                date: newItem.date,
            });
            setNewItem({
                name: '',
                quantity: 0,
                date: '',
            });
            fetchData(); // Refresh the data
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    const deleteItem = async (id: string, currentQuantity: number) => {
        try {
            if (currentQuantity > 1) {
                // Decrement the quantity by 1
                await updateDoc(doc(firestore, 'inventory', id), {
                    quantity: currentQuantity - 1
                });
            } else {
                // Remove the item when quantity reaches 0
                await deleteDoc(doc(firestore, 'inventory', id));
            }
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error updating/removing document: ", error);
        }
    };

    const incrementItem = async (id: string, currentQuantity: number) => {
        try {
            await updateDoc(doc(firestore, 'inventory', id), {
                quantity: currentQuantity + 1
            });
            fetchData(); // Refresh the data
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const columns = [
        columnHelper.accessor('name', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('quantity', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">QUANTITY</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('date', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>,
            cell: (info) => <p className="text-sm font-bold text-navy-700 dark:text-white">{info.getValue()}</p>,
        }),
        columnHelper.accessor('actions', {
            header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ACTIONS</p>,
            cell: (info) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => incrementItem(info.row.original.id!, info.row.original.quantity)}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => deleteItem(info.row.original.id!, info.row.original.quantity)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        {info.row.original.quantity > 1 ? 'remove' : 'Delete'}
                    </button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true,
    });

    return (
        <Card extra={'w-full h-full sm:overflow-auto px-6'}>
            <header className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold text-navy-700 dark:text-white">Check Table</div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                >
                    Add new item
                </button>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center" id="my-modal">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Item</h3>
                            <div className="mt-2 px-7 py-3">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="px-3 py-2 border rounded w-full mb-3"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Quantity"
                                    className="px-3 py-2 border rounded w-full mb-3"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                />
                                <input
                                    type="date"
                                    placeholder="Date"
                                    className="px-3 py-2 border rounded w-full mb-3"
                                    value={newItem.date}
                                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                                />
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    id="ok-btn"
                                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    onClick={addItem}
                                >
                                    Add Item
                                </button>
                            </div>
                            <div className="items-center px-4 py-3">
                                <button
                                    id="cancel-btn"
                                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table className="w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="!border-px !border-gray-400">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className="cursor-pointer border-b border-gray-200 pb-2 pr-4 pt-4 text-start dark:border-white/30"
                                    >
                                        <div className="items-center justify-between text-xs text-gray-200">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: '',
                                                desc: '',
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="min-w-[150px] border-white/0 py-3 pr-4">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

export default CheckTable;
