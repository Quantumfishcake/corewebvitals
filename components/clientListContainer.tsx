import type { ClientDataType } from "@/types";
import { useState, useCallback } from "react";
import axios from "axios";
import * as React from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Collapse from "./collapse";

import {
  GridColDef,
  DataGrid,
  GridRowModel,
} from '@mui/x-data-grid';

export type GridRow = {
  id: number;
  name: string;
  status: string;
  smartpages: string;
  categorypage: string;
};

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", sortable: true, minWidth: 150, flex: 0.5, headerClassName: 'super-app-theme--header' },
  { field: "status", headerName: "Status", editable: true, headerClassName: 'super-app-theme--header' },
  { field: "smartpages", headerName: "SmartPage", minWidth: 300, flex: 1, editable: true, headerClassName: 'super-app-theme--header' },
  { field: "categorypage", headerName: "Category Page", minWidth: 300, flex: 1, headerClassName: 'super-app-theme--header' },
];

const ClientListContainer: React.FC<{ clientList: Array<ClientDataType>, updateData: Function }> = ({ clientList, updateData }) => {

  const [promiseArguments, setPromiseArguments] = useState<any>(null);

  const updateClientStatus = (oldRow: GridRow, newRow: GridRow): Promise<any> => {
    // workout the field that has changed
    const field = Object.keys(newRow).find((key) => {
      return newRow[key as keyof GridRow] !== oldRow[key as keyof GridRow]
    });
    return axios.post('/api/updateClientStatus', { id: newRow.id, newValue: newRow[field as keyof GridRow], field: field })
  }

  function computeMutation(newRow: GridRowModel, oldRow: GridRowModel) {
    if (newRow.status !== oldRow.status) {
      return `Status for '${oldRow.name || ''}' from '${oldRow.status}' to '${newRow.status || ''}'`;
    }
    if (newRow.smartpages !== oldRow.smartpages) {
      return `Status for '${oldRow.name || ''}' from '${oldRow.smartpages}' to '${newRow.smartpages || ''}'`;
    }
    return null;
  }

  const processRowUpdate = useCallback(
    (newRow: GridRowModel, oldRow: GridRowModel) =>
      new Promise<GridRowModel>((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          console.log(mutation)
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow); // Nothing was changed
        }
      }),
    [],
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      setPromiseArguments(null);
      // Make the HTTP request to save in the backend
      const response = await toast.promise(
        updateClientStatus(oldRow, newRow),
        {
          pending: 'Updating Data',
          success: 'Data successfully updated 👌',
          error: 'Promise rejected 🤯'
        }
      );
      updateData();
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <div className="modal modal-open " id="my-modal-2">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-slate-700">Are you sure?</h3>
          <p className="py-4 text-slate-600"> {`Pressing 'Yes' will change ${mutation}.`}</p>
          <div className="flex justify-between">
            <div className="modal-action" onClick={handleYes}>
              <a href="#" className="btn btn-success">Yes</a>
            </div>
            <div className="modal-action" onClick={handleNo}>
              <a href="#" className="btn btn-error">No</a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const clientListContainerContent = () => {
    return (
      <div className="flex flex-col h-96 w-full my-4 ">
        {renderConfirmDialog()}
        <DataGrid
          columns={columns}
          rows={clientList}
          processRowUpdate={processRowUpdate}
          sx={{
            boxShadow: 2,
            background: 'rgb(30 41 59)',
            border: 1,
            color: 'rgb(226 232 240)',
            borderColor: 'rgb(51 65 85)',
            '& .super-app-theme--header': {
              backgroundColor: 'rgb(15 23 42)',
            },
          }}
          getRowClassName={(params) => `dark-content`}
        />
      </div>
    );
  }

  return (
    <div className="my-4">
      <Collapse title={<h3 className="text-slate-300 py-2">Client List</h3>} content={clientListContainerContent()} />
    </div>
  );
};

export default ClientListContainer;