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
  IconButton,
} from "@chakra-ui/react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ContextProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleSearch = async (q) => {
    if (!q) {
      // when search querey is empty searchresults should also be empty
      setSearchResult([]);
      return null;
    }
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

  const handleRenameGroup = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter a name to update",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return null;
    }
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat?._id,
          chatName: groupChatName,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelectedChat(data);
      // chats will be refetched wheneve fetchAgain changes.That's the reason we are inverting fetchAgain
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      onClose();
    } catch (err) {
      setRenameLoading(false);
      setGroupChatName("");
      console.log(err);
    }
  };

  const handleAdd = async (userToAdd) => {
    if (selectedChat.users.find((u) => userToAdd._id === u._id)) {
      toast({
        title: "User is already part of the group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      // setGroupChatName("");
      // setSearchResult([]);
      return null;
    }

    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "Only group admins can add users",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      // setGroupChatName("");
      // setSearchResult([]);
      return null;
    }

    try {
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSelectedChat(data);
      toast({
        title: `Successfully added ${userToAdd.name} to group`,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setSearchResult([]);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to add user",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      console.log(err);
    }
  };

  const handleRemove = async (userToRemove) => {
    if (user._id !== selectedChat.groupAdmin._id) {
      toast({
        title: "Only group admins can remove users",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return null;
    }
    // if (userToRemove._id === selectedChat.groupAdmin._id) {
    //   toast({
    //     title: "you cant remove yourself",
    //     status: "warning",
    //     duration: 2000,
    //     isClosable: true,
    //     position: "top",
    //   });
    //   return null;
    // }
    try {
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      // user should not see the chat if he leave from the group
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      // messages needs to be refetched
      fetchMessages();
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to remove user",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
      console.log(err);
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Update Group Chat
          </ModalHeader>
          <ModalCloseButton onClick={() => setSearchResult([])} />
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box d="flex" flexWrap="wrap">
              {selectedChat.users.length !== 0 &&
                selectedChat.users.map((usr) => {
                  return (
                    <UserBadgeItem
                      key={usr._id}
                      user={usr}
                      admin={selectedChat.groupAdmin._id}
                      handleFunction={() => handleRemove(usr)}
                    ></UserBadgeItem>
                  );
                })}
            </Box>

            <FormControl d="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRenameGroup}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Box w="100%" d="flex" flexDir="column">
                {/* only top 4 results */}
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
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
