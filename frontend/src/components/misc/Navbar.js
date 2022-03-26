import React from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ContextProvider";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  Badge,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import ProfileModal from "../misc/ProfileModal";
import SideDrawer from "./SideDrawer";
import { getSender } from "../../helpers/ChatLogics";
function Navbar() {
  const { user, setSelectedChat, notifications, setNotifications } =
    ChatState();

  //refer https://chakra-ui.com/docs/hooks/use-disclosure
  // for side drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  console.log(notifications);
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
              <Badge colorScheme="red" variant="outline" rounded>
                {notifications.length > 0 && notifications.length}
              </Badge>
            </MenuButton>
            <MenuList pl={2}>
              {notifications.length === 0 && "No new messages"}

              {notifications.map((ntfn) => {
                return (
                  <MenuItem
                    key={ntfn._id}
                    onClick={() => {
                      setSelectedChat(ntfn.chat);
                      // remove the selected notification from the notifications array
                      setNotifications(notifications.filter((n) => n !== ntfn));
                    }}
                  >
                    {ntfn.chat.isGroupChat
                      ? `New message in ${ntfn.chat.name}`
                      : `New message from  ${getSender(user, ntfn.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <SideDrawer user={user} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Navbar;
