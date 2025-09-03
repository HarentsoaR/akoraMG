"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link as RouterLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Badge,
  Collapse,
  alpha,
} from "@mui/material"
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  Person as ProfileIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material"

interface LayoutProps {
  children: React.ReactNode
}

const drawerWidth = 280

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Categories"])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const location = useLocation()

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const handleDrawerToggle = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const handleExpandClick = (item: string) => {
    setExpandedItems((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]))
  }

  const menuItems = [
    {
      text: "Home",
      icon: <HomeIcon />,
      path: "/",
      badge: null,
    },
    {
      text: "Search",
      icon: <SearchIcon />,
      path: "/search",
      badge: null,
    },
    
    {
      text: "Wishlist",
      icon: <FavoriteIcon />,
      path: "/wishlist",
      badge: "3",
    },
    {
      text: "Cart",
      icon: <CartIcon />,
      path: "/cart",
      badge: "2",
    },
    {
      text: "Profile",
      icon: <ProfileIcon />,
      path: "/profile",
      badge: null,
      subItems: [
        { text: "My Orders", path: "/profile/orders" },
        { text: "My Reviews", path: "/profile/reviews" },
        { text: "Account Settings", path: "/profile/settings" },
      ],
    },
  ]

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  const drawerContent = (
    <Box sx={{ width: drawerWidth, height: "100%", overflow: "hidden" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #1976d2 0%, #2196f3 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            width: 48,
            height: 48,
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          RA
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
            Rasoa Andry
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, fontSize: "0.85rem" }}>
            rasoa@fivoarana.mg
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <motion.div initial="hidden" animate="visible" variants={listVariants}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <motion.div key={item.text} variants={itemVariants}>
                <ListItem
                  component={item.subItems ? "div" : RouterLink}
                  to={item.subItems ? undefined : item.path}
                  onClick={
                    item.subItems ? () => handleExpandClick(item.text) : isMobile ? handleDrawerToggle : undefined
                  }
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    mx: 0.5,
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                      transform: "translateX(4px)",
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      "& .MuiListItemIcon-root": {
                        color: "white",
                      },
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }),
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      fontSize: "0.95rem",
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.75rem",
                        backgroundColor:
                          location.pathname === item.path ? "rgba(255,255,255,0.2)" : theme.palette.primary.main,
                        color: location.pathname === item.path ? "white" : "white",
                      }}
                    />
                  )}
                  {item.subItems && (expandedItems.includes(item.text) ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>

                {/* Sub Items */}
                {item.subItems && (
                  <Collapse in={expandedItems.includes(item.text)} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItem
                          key={subItem.text}
                          component={RouterLink}
                          to={subItem.path}
                          onClick={isMobile ? handleDrawerToggle : undefined}
                          sx={{
                            pl: 6,
                            borderRadius: 2,
                            mx: 0.5,
                            mb: 0.25,
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                              transform: "translateX(8px)",
                            },
                            ...(location.pathname === subItem.path && {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              borderLeft: `3px solid ${theme.palette.primary.main}`,
                            }),
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                              mr: 2,
                              opacity: location.pathname === subItem.path ? 1 : 0.5,
                            }}
                          />
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: "0.875rem",
                              fontWeight: location.pathname === subItem.path ? 600 : 400,
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </motion.div>
            ))}
          </List>
        </motion.div>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.8),
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          © 2024 Fivoarana
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          v2.1.0
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
          ml: { md: `${isSidebarOpen ? drawerWidth : 0}px` },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSidebarOpen ? "close" : "menu"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                </motion.div>
              </AnimatePresence>
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #1976d2, #2196f3)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.5rem",
              }}
            >
              Fivoarana
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Avatar sx={{ width: 32, height: 32 }}>RA</Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDrawerToggle}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.5)",
              zIndex: 1200,
              backdropFilter: "blur(4px)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={isSidebarOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
            background: theme.palette.background.paper,
            boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
          },
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: { md: !isSidebarOpen ? `-${drawerWidth}px` : 0 },
          width: "100%",
          minHeight: "100vh",
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
      </Box>
    </Box>
  )
}

export default Layout
