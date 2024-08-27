import { useTable, usePagination ,useGlobalFilter } from 'react-table'
import React from 'react'
import { TiDelete } from "react-icons/ti"; 
import { AiTwotoneEdit } from "react-icons/ai"; 

function TableComponent({setDefaultData,deletePasseport, Passport }) {

  const a =Passport
  const passport = a.map((item,index)=>{
    return {
      "col1":index,
      "col2":item.name,
      "col3":item.contry,
      "col4":item.cartId,
      "col5":item.dateDel,
      "col6":item.dateExp,
      "col7":item.img,
      "col8":item
    }
  })  

  
  
  const data = React.useMemo(
    ()=>passport,
    [Passport]
  )


  const columns = React.useMemo(


    () => [
  
      {
  
        Header: 'N',
  
        accessor: 'col1', // accessor is the "key" in the data
  
      },
      {
  
        Header: 'Nom',
  
        accessor: 'col2', // accessor is the "key" in the data
  
      },
      {
  
        Header: 'Pays',
  
        accessor: 'col3',
  
      },
      {
  
        Header: 'identifiant',
  
        accessor: 'col4', // accessor is the "key" in the data
  
      },
  
      {
  
        Header: 'délivrance',
  
        accessor: 'col5',
  
      },
      {
        Header:"expiration",
        accessor:"col6"
      },
      {
  
        Header: 'photo',
  
        accessor: 'col7',
  
      },
      {
        Header:"action",
        accessor:"col8"
      }
  
    ],
  
    []
  
  )
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 ,pageSize:5},
    },
    useGlobalFilter,
    usePagination
    
  )

  // Render the UI for your table
  return (
    <>
      <div className='table-responsive'>
          <table className='table' {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup,key) => (
                  <tr key={key} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column,index) => (
                      <th key={index} {...column.getHeaderProps()}>{column.render('Header')}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, key) => {
                  prepareRow(row)
                  return (
                    <tr key={key} {...row.getRowProps()}>
                        <td  {...row.cells[0].getCellProps()}>{row.cells[0].render('Cell')}</td>
                        <td  {...row.cells[1].getCellProps()}>{row.cells[1].render('Cell')}</td>
                        <td  {...row.cells[2].getCellProps()}>{row.cells[2].render('Cell')}</td>
                        <td  {...row.cells[3].getCellProps()}>{row.cells[3].render('Cell')}</td>
                        <td {...row.cells[4].getCellProps()}>{row.cells[4].value.toString().replaceAll('\n',"").replaceAll(" ","")}</td>
                        <td {...row.cells[5].getCellProps()}>{row.cells[5].value.toString().replaceAll('\n',"").replaceAll(" ","")}</td>
                        <td {...row.cells[6].getCellProps()}><img width={50} height={50} src={row.cells[6].value} alt="image" /></td>
                        <td><TiDelete onClick={()=>{deletePasseport(row.cells[7].value)}} style={{color:"red"}} className="fs-3" /><AiTwotoneEdit onClick={()=>{setDefaultData(row.cells[7].value)}} data-bs-toggle="modal" data-bs-target="#staticBackdrop"  className="text-primary fs-3"/></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
      </div>
          
       {
        data.length>5 && (
          <div className="direction">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} sur {pageOptions.length}
            </strong>{' '}
          </span>
        </div>
        )
       }
     
    </>
  )
}


export default TableComponent