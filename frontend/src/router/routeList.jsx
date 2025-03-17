import { Homepage } from "../Component/Pages/Homepage";
import { RoomPage } from "../Component/Pages/Roompage";
import Settings from "../Component/Pages/Settings";
import { routerLabels } from "../utils/router/routerLabels";
import { LoginPage } from "../Component/Pages/Loginpage";
import Admin from "../Component/Pages/Admin";
import Devices from "../Component/Pages/Devices";
import Blocks from "../Component/Pages/Blocks";
import Users from "../Component/Pages/Users";
import Logout from "../Component/Auth/Logout";
import BlockPage from "../Component/Pages/BlockPage";
import ProtectedRoute from "./protectedRoute"; 

export const routes = [
    {
        path: "/",
        label: routerLabels.home,
        element: <Homepage />
    },
    {
        path: "/:blockName/:roomNumber",
        label: routerLabels.block,
        element: <RoomPage />
    },
    {
        path: "/:blockName",
        label: routerLabels.blockName,
        element: <BlockPage />
    },
    {
        path: "/login",
        label: routerLabels.login,
        element: <LoginPage />
    },
    {
        path: "/logout",
        label: routerLabels.logout,
        element: <Logout />
    },
    {
        path: "/settings",
        label: routerLabels.settings,
        element: <Settings />
    },

    // Admin Routes (Protected)
    {
        path: "/admin",
        label: routerLabels.admin,
        element: <ProtectedRoute adminOnly={true} />,
        children: [
            { path: "/admin", element: <Admin /> },
            { path: "/admin/blocks", element: <Blocks /> },
            { path: "/admin/users", element: <Users /> },
            { path: "/admin/devices", element: <Devices /> }
        ]
    }
];
