import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ContextProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = ChatState();

  const handleAdd = (userToAdd) => {
    // if same reference is passed to include it also works with array of objects
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return null;
    }
    setSelectedUsers([userToAdd, ...selectedUsers]);
  };

  const handleDelete = (userToDelete) => {
    const usersAfterDeleting = selectedUsers.filter(
      (selectedUser) => selectedUser._id !== userToDelete._id
    );
    setSelectedUsers(usersAfterDeleting);
  };

  const handleSearch = async (q) => {
    if (!q) return null;
    setSearch(q);
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?q=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResult(data.result);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <div>Loading...</div>
            ) : (
              selectedUsers.length !== 0 &&
              selectedUsers.map((usr) => {
                return (
                  <UserBadgeItem
                    key={usr._id}
                    user={usr}
                    handleFunction={() => handleDelete(usr)}
                  ></UserBadgeItem>
                );
              })
            )}
            <Box w="100%" d="flex" flexWrap="wrap">
              {searchResult?.slice(0, 4).map((usr) => {
                return (
                  <UserListItem
                    key={usr._id}
                    user={usr}
                    handleFunction={() => handleAdd(usr)}
                  ></UserListItem>
                );
              })}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
