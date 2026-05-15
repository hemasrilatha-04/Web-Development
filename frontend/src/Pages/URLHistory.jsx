import React, { useEffect, useState } from 'react'

import Service from "../utils/http.js";

import {
  Button,
  Modal,
  Table,
  TextInput
} from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';

const URLhistory = () => {

   const [opened, { open, close }] =
      useDisclosure(false);

   const [updatedData, setUpdatedData] =
      useState({});

   const [data, setData] = useState([]);

   const [shortCode, setShortCode] =
      useState("");

   const service = new Service();

   const fetchHistory = async () => {

       try {

          const response =
            await service.get("url/list");

          console.log(response);

          setData(response.shortUrls || []);

       } catch (error) {

           console.error(error);
       }
   }

   useEffect(() => {

       fetchHistory();

   }, []);

   const handleSubmit = async () => {

       try {

          await service.patch(
            `s/${shortCode}`,
            updatedData
          );

          close();

          fetchHistory();

       } catch (error) {

          console.error(error.message);
       }
   }

   const handleUpdate = (element) => {

       setShortCode(element.shortCode);

       setUpdatedData({
           originalUrl: element.originalUrl,
           title: element.title,
       });

       open();
   }

   const handleDelete = async (shortCode) => {

      try {

         await service.delete(
           `url/${shortCode}`
         );

         setData(
            data.filter(
               (item) =>
                 item.shortCode !== shortCode
            )
         );

      } catch (error) {

         console.error(error.message);
      }
   }

   return (
       <div>

           <Table highlightOnHover>

               <Table.Thead>

                   <Table.Tr>
                       <Table.Th>Original URL</Table.Th>
                       <Table.Th>Short Code</Table.Th>
                       <Table.Th>Click Count</Table.Th>
                       <Table.Th>Created At</Table.Th>
                       <Table.Th>Expires At</Table.Th>
                       <Table.Th>Actions</Table.Th>
                   </Table.Tr>

               </Table.Thead>

               <Table.Tbody>

                   {
                     data.map((element) => (

                       <Table.Tr key={element._id}>

                           <Table.Td>
                             {element.originalUrl}
                           </Table.Td>

                           <Table.Td>
                             {element.shortCode}
                           </Table.Td>

                           <Table.Td>
                             {element.clickCount}
                           </Table.Td>

                           <Table.Td>
                             {element.createdAt}
                           </Table.Td>

                           <Table.Td>
                             {element.expiresAt}
                           </Table.Td>

                           <Table.Td>

                               <Button
                                 size="xs"
                                 onClick={() =>
                                   handleUpdate(element)
                                 }
                               >
                                 Edit
                               </Button>

                           </Table.Td>

                           <Table.Td>

                               <Button
                                 color="red"
                                 size="xs"
                                 onClick={() =>
                                   handleDelete(
                                     element.shortCode
                                   )
                                 }
                               >
                                 Delete
                               </Button>

                           </Table.Td>

                       </Table.Tr>
                     ))
                   }

               </Table.Tbody>

           </Table>

           <Modal
             opened={opened}
             onClose={close}
             title="Edit URL"
           >

               <TextInput
                   value={updatedData.originalUrl || ""}
                   label="Enter new URL"
                   onChange={(e) => {
                       setUpdatedData({
                         ...updatedData,
                         originalUrl: e.target.value
                       });
                   }}
               />

               <TextInput
                   value={updatedData.title || ""}
                   label="Enter New Title"
                   onChange={(e) => {
                       setUpdatedData({
                         ...updatedData,
                         title: e.target.value
                       });
                   }}
               />

               <Button
                 mt={10}
                 onClick={handleSubmit}
               >
                 Update
               </Button>

           </Modal>

       </div>
   )
}

export default URLhistory;