import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';

export const RoutesList = [
  { screenOrder: 1, screen: "dashboard", path: "dashboard", name: "Dashboard", Icon: EqualizerIcon, },
  { screenOrder: 2, screen: "category", path: "category", name: "Category", Icon: DashboardIcon, },
  { screenOrder: 3, screen: "product", path: "product", name: "Product", Icon: CategoryIcon },
  { screenOrder: 4, screen: "user", path: "user", name: "User", Icon: SupervisedUserCircleIcon },
  { screenOrder: 5, screen: "buyer", path: "buyers", name: "Buyers", Icon: Diversity3Icon },
  { screenOrder: 6, screen: "order", path: "orders", name: "Orders", Icon: StorefrontIcon, },
  { screenOrder: 7, screen: "profile", path: "profile", name: "Profile", Icon: AccountBoxIcon, },
];