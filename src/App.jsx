import { useState } from 'react'
import norrflyttlogo from './assets/images/logo.png'
import './index.css'
import { FaPhone } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaX } from "react-icons/fa6";
import jsPDF from 'jspdf';

function App() {

  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    id: 1,
    object: '',
    width: '',
    height: '',
    depth: '',
    amount: 1,
  })
  const [totalCubicVolume, setTotalCubicVolume] = useState(0);

  const handleChange = (e, rowId) => {
    console.log("rowid = " + rowId)

    const { name, value } = e.target;

    console.log(e.target)
  
    console.log(`Handling change for ${name} with value ${value}`);
  
    if (typeof rowId !== 'undefined') {
      // Update existing row
      const updatedRows = [...rows];
      updatedRows[rowId-1] = {
        ...updatedRows[rowId-1],
        [name]: value,
      }
      console.log("Updated rows:", updatedRows)
      setRows(updatedRows)
      const newVolume = calculateTotalVolume(updatedRows)
      setTotalCubicVolume(newVolume);
    } else {
      // Create new row
      setNewRow((prevRow) => ({
        ...prevRow,
        [name]: value,
      }));
    }
    calculateTotalVolume(rows)
  };

  const calculateTotalVolume = (rows) => {
    let totalVolume = 0;
    rows.forEach((row) => {
      totalVolume +=
        (parseInt(row.width) / 100) *
        (parseInt(row.height) / 100) *
        (parseInt(row.depth) / 100) *
        row.amount;
    });
    totalVolume = Math.round((totalVolume + Number.EPSILON) * 100) / 100
    return totalVolume;
  };

  const addNewRow = () => {
    const updatedRows = [...rows, { ...newRow, id: newRow.id }];
    const newVolume = calculateTotalVolume(updatedRows);
    setTotalCubicVolume(newVolume);
    setRows(updatedRows);

    setNewRow((prevRow) => ({
      id: prevRow.id + 1,
      object: '',
      width: '',
      height: '',
      depth: '',
      amount: 1,
    }));
  };

  const removeRow = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    const newVolume = calculateTotalVolume(updatedRows);
    setTotalCubicVolume(newVolume);
    setRows(updatedRows);
  };

  const saveAsPDF = () => {
    const doc = new jsPDF();
  
    // Example: Adding text to the PDF
    doc.text("Flyttkalkylator", 10, 10);
    
    // Example: Adding rows of data
    let y = 20;
    rows.forEach((row, index) => {
      const rowData = `${row.id}: ${row.object} - ${row.width}x${row.height}x${row.depth}, Antal: ${row.amount}`;
      doc.text(rowData, 10, y);
      y += 10;
    });
  
    // Example: Adding total cubic volume
    doc.text(`Total mängd kubik (m³): ${totalCubicVolume}`, 10, y + 10);
  
    // Save the PDF
    doc.save('flyttkalkyl.pdf');
  };

  return (
    <div className='w-screen h-screen font-opensans select-none'>
      <div className='w-full h-9 bg-[#2D4D57] text-white flex justify-evenly text-sm sm:justify-end'>
        <div className='flex items-center mx-6 sm:mx-16'>
          <FaPhone className='mr-2 text-orange-500'/>
          <a href='tel:09042010'><span>090 - 420 10</span></a>
        </div>
        <div className='flex items-center mx-6 sm:mx-166'>
          <FaRegEnvelope className='mr-2 text-orange-500'/>
          <a href='mailto:info@norrflytt.se'>info@norrflytt.se</a>
        </div>
      </div>
      <header className='w-full h-52px sm:h-[86px] shadow-lg py-2 pl-8 sm:px-[96px]'>
        <a href="https://norrflytt.se/">
            <img src={norrflyttlogo} alt="" className='h-full' />
        </a>  
      </header>
      <div className='w-full flex justify-center items-center text-4xl py-4'>Flyttkalkylator</div>
      <div className='flex flex-col px-1 h-3/4 text-sm sm:text-base sm:px-10 '> 
        <div className='overflow-y-auto overflow-x-hidden mb-6 border border-black'>
          <table className='w-full h-full table-auto '>
            <thead>
              <tr className='border-b-2 border-black h-4'>
                <td className='w-14 '><label>ID</label></td>
                <td className='border-x-2 border-black'><label>Objekt</label></td>
                <td className='border-x-2 border-black'><label>Bredd (cm)</label></td>
                <td className='border-x-2 border-black'><label>Höjd (cm)</label></td>
                <td className='border-x-2 border-black'><label>Djup (cm)</label></td>
                <td className='border-x-2 border-black'><label>Antal</label></td>
                
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className='border-y h-4 '>
                  <td>{row.id}</td>
                  <td className='border-x-2 border-black'><input type="text" name="object" value={row.object} onChange={(e) => handleChange(e, row.id)} className='p-1 w-full hover:bg-slate-100' /></td>
                  <td className='border-x-2 border-black'><input type="number" name="width" value={row.width} onChange={(e) => handleChange(e, row.id)} className='p-1 w-12 sm:w-full hover:bg-slate-100' /></td>
                  <td className='border-x-2 border-black'><input type="number" name="height" value={row.height} onChange={(e) => handleChange(e, row.id)} className='p-1 w-12 sm:w-full hover:bg-slate-100' /></td>
                  <td className='border-x-2 border-black'><input type="number" name="depth" value={row.depth} onChange={(e) => handleChange(e, row.id)} className='p-1 w-12 sm:w-full hover:bg-slate-100' /></td>
                  <td className='border-x-2 border-black'><input type="number" name="amount" value={row.amount} onChange={(e) => handleChange(e, row.id)} className='p-1 w-12 sm:w-full hover:bg-slate-100' /></td>
                  <td className='hover:bg-red-500/50 active:bg-red-700 flex items-center justify-center h-9 hover:cursor-pointer' onClick={() => removeRow(row.id)} >
                    <button type='button' className='bg-red-500 h-6 w-6 rounded-full p-1.5 sm:p-1'> <FaX /> </button>
                  </td>
                </tr>
              ))}
              <tr className='border-y h-4 bg-green-200/70'>
                <td><span className='text-slate-800/20'>-</span></td>
                <td className='border-x-2 border-black'><input type="text" name="object" value={newRow.object} onChange={handleChange} placeholder='objekt' size={100} className='p-1 w-full bg-transparent hover:bg-green-100' /></td>
                <td className='border-x-2 border-black'><input type="number" name="width" value={newRow.width} onChange={handleChange} placeholder='0' className='p-1 w-12 sm:w-full bg-transparent hover:bg-green-100' /></td>
                <td className='border-x-2 border-black'><input type="number" name="height" value={newRow.height} onChange={handleChange} placeholder='0' className='p-1 w-12 sm:w-full bg-transparent hover:bg-green-100' /></td>
                <td className='border-x-2 border-black'><input type="number" name="depth" value={newRow.depth} onChange={handleChange} placeholder='0' className='p-1 w-12 sm:w-full bg-transparent hover:bg-green-100' /></td>
                <td className='border-x-2 border-black'><input type="number" name="amount" value={newRow.amount} onChange={handleChange} placeholder='1' className='p-1 w-12 sm:w-full bg-transparent hover:bg-green-100' /></td>
                <td className='hover:bg-green-300/20 active:bg-green-500 flex items-center justify-center h-9 hover:cursor-pointer w-10 sm:w-20' onClick={addNewRow}>
                  <button type='button' className='bg-green-300 h-6 w-6 rounded-full p-1.5 sm:p-1  border-0' ><FaPlus /></button>
                </td>
              </tr>
            <tr></tr>
            </tbody>
          </table>
        </div>
        <div className='flex justify-between mt-auto'>
          <div className='flex text-xl'>
            <p>Total mängd kubik (m&#179;) =</p>
            <p className='mx-2 font-semibold '>{totalCubicVolume}</p>
          </div>
          <button type='button' className='w-40 h-14 bg-orange-500 rounded-lg border-2 border-black font-bold mx-6' onClick={saveAsPDF}>Spara kalkyl som PDF</button> 
        </div>
      </div> 

    </div>
  )
}

export default App