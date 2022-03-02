import React, { useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  Box,
  Spinner,
} from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

function SideDrawer({ isOpen, onClose }) {
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const handleSearch = () => {
    try {
      setLoading(true);
      setTimeout(() => {
        console.log("hello");
        setLoading(false);
      }, 3000);
      // console.log("hello");
    } catch (err) {
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
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
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
