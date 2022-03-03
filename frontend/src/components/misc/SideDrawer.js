import React, { useState } from "react";
import axios from "axios";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Input,
  Button,
  Box,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

function SideDrawer({ user, isOpen, onClose }) {
  const toast = useToast();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    try {
      if (!search) {
        toast({
          title: "Type in something to search",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return null;
      }
      setLoading(true);
      const { data } = await axios.get(`/api/user?q=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResult(data.result);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const accessChat = () => {};
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
          <Box d="flex" pb={2}>
            <Input
              placeholder="Search by name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : searchResult && searchResult.length === 0 ? (
            <span>No results found</span>
          ) : (
            searchResult?.map((usr) => (
              <UserListItem
                key={usr._id}
                user={usr}
                handleFunction={() => accessChat(usr._id)}
              />
            ))
          )}
          {loading && <Spinner ml="auto" d="flex" />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default SideDrawer;
