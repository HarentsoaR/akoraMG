"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Container,
  Chip,
  Rating,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material"
import {
  ArrowForward as ArrowForwardIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
} from "@mui/icons-material"

// Enhanced mock data
const featuredProducts = [
  {
    id: 1,
    name: "Hand-woven Raffia Basket",
    artisan: "Rasoa Raharimampionona",
    price: "MGA 75,000",
    originalPrice: "MGA 85,000",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 24,
    category: "Basketry",
    isNew: true,
    discount: 12,
    isFavorite: false,
  },
  {
    id: 2,
    name: "Carved Wooden Sculpture",
    artisan: "Jean Rakotomalala",
    price: "MGA 150,000",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 18,
    category: "Wood Carving",
    isFeatured: true,
    isFavorite: true,
  },
  {
    id: 3,
    name: "Embroidered Table Runner",
    artisan: "Marie Razafy",
    price: "MGA 45,000",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 31,
    category: "Textiles",
    isPopular: true,
    isFavorite: false,
  },
  {
    id: 4,
    name: "Traditional Jewelry Set",
    artisan: "Sophie Andriamihaja",
    price: "MGA 95,000",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 15,
    category: "Jewelry",
    isLimited: true,
    isFavorite: false,
  },
]

const categories = [
  {
    name: "Textiles",
    count: 156,
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=200&fit=crop",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Wood Carving",
    count: 89,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "Jewelry",
    count: 124,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    name: "Pottery",
    count: 67,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&h=200&fit=crop",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
]

const Home: React.FC = () => {
  const navigate = useNavigate()
  const theme = useTheme()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <Box>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #21cbf3 100%)",
            color: "white",
            mb: 6,
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            },
          }}
        >
          <CardContent sx={{ p: { xs: 4, md: 6 }, position: "relative", zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Chip
                    label="✨ New Collection Available"
                    sx={{
                      mb: 3,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      lineHeight: 1.1,
                      mb: 3,
                    }}
                  >
                    Discover Authentic
                    <Box
                      component="span"
                      sx={{
                        display: "block",
                        background: "linear-gradient(45deg, #FFD700, #FFA500)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Malagasy Crafts
                    </Box>
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Typography
                    variant="h5"
                    paragraph
                    sx={{
                      mb: 4,
                      opacity: 0.95,
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    Support local artisans and bring home unique, handcrafted treasures that tell the story of
                    Madagascar's rich cultural heritage.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate("/categories")}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        backgroundColor: "white",
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: alpha("#ffffff", 0.9),
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      Explore Products
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderColor: "rgba(255,255,255,0.5)",
                        color: "white",
                        fontWeight: 600,
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          transform: "translateY(-2px)",
                        },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      Meet Artisans
                    </Button>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  <Box sx={{ position: "relative", display: { xs: "none", md: "block" } }}>
                    <img
                      src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=400&fit=crop"
                      alt="Malagasy crafts showcase"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 16,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: -16,
                        right: -16,
                        backgroundColor: "white",
                        borderRadius: 2,
                        p: 2,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <StarIcon sx={{ color: "#FFD700" }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
                        4.8
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        2.1k reviews
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Featured Products */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <motion.div variants={itemVariants}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
              <Box>
                <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                  Featured Products
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Handpicked treasures from our talented artisans
                </Typography>
              </Box>
              <Button variant="outlined" endIcon={<ArrowForwardIcon />} sx={{ display: { xs: "none", sm: "flex" } }}>
                View All
              </Button>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {featuredProducts.map((product, index) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                      border: "1px solid",
                      borderColor: "divider",
                      "&:hover": {
                        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{
                          transition: "transform 0.3s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />

                      {/* Badges */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {product.isNew && (
                          <Chip label="New" size="small" sx={{ backgroundColor: "#4caf50", color: "white" }} />
                        )}
                        {product.isFeatured && (
                          <Chip label="Featured" size="small" sx={{ backgroundColor: "#9c27b0", color: "white" }} />
                        )}
                        {product.isPopular && (
                          <Chip label="Popular" size="small" sx={{ backgroundColor: "#ff9800", color: "white" }} />
                        )}
                        {product.isLimited && (
                          <Chip label="Limited" size="small" sx={{ backgroundColor: "#f44336", color: "white" }} />
                        )}
                        {product.discount && (
                          <Chip
                            label={`-${product.discount}%`}
                            size="small"
                            sx={{ backgroundColor: "#f44336", color: "white" }}
                          />
                        )}
                      </Box>

                      {/* Action Buttons */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          opacity: 0,
                          transition: "opacity 0.3s ease-in-out",
                          ".MuiCard-root:hover &": {
                            opacity: 1,
                          },
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            "&:hover": { backgroundColor: "white" },
                          }}
                        >
                          {product.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: "rgba(255,255,255,0.9)",
                            "&:hover": { backgroundColor: "white" },
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                      <Chip
                        label={product.category}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1.5, fontSize: "0.75rem" }}
                      />

                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 600,
                          fontSize: "1rem",
                          lineHeight: 1.3,
                          mb: 1,
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 1.5 }}>
                        by {product.artisan}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Rating value={product.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {product.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({product.reviews})
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                            {product.price}
                          </Typography>
                          {product.originalPrice && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: "text.secondary",
                                fontSize: "0.875rem",
                              }}
                            >
                              {product.originalPrice}
                            </Typography>
                          )}
                        </Box>
                        <IconButton
                          color="primary"
                          sx={{
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            "&:hover": {
                              backgroundColor: theme.palette.primary.main,
                              color: "white",
                            },
                          }}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>

      {/* Categories */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 1, fontWeight: 700 }}>
              Browse Categories
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Explore our diverse collection of traditional crafts
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item key={category.name} xs={12} sm={6} md={3}>
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    sx={{
                      height: 160,
                      cursor: "pointer",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                      },
                    }}
                    onClick={() => navigate(`/categories/${category.name.toLowerCase()}`)}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background: category.gradient,
                        opacity: 0.9,
                        zIndex: 1,
                      }}
                    />
                    <CardMedia
                      component="img"
                      height="160"
                      image={category.image}
                      alt={category.name}
                      sx={{
                        position: "absolute",
                        inset: 0,
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {category.count} products
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <Container maxWidth="lg">
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              borderRadius: 4,
              p: 6,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                    500+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Artisan Partners
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                    2,000+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Unique Products
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>
                    10,000+
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Happy Customers
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </motion.div>
    </Box>
  )
}

export default Home
