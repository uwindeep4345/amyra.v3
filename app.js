// amyra Collections E-commerce Application with Google OAuth

class AmyraCollections {
    constructor() {
        this.currentUser = null;
        this.userType = null; // 'customer' or 'admin'
        this.adminRole = null; // 'main_admin' or 'sub_admin'
        this.products = [];
        this.filteredProducts = [];
        this.customers = [];
        this.orders = [];
        this.admins = [];
        this.cart = [];
        this.currentCategory = 'all';
        this.currentSubcategory = 'all';
        this.currentPriceRange = 'all';
        this.currentSort = 'popularity';
        this.searchQuery = '';
        this.nextProductId = 9;
        this.nextOrderId = 1;
        this.nextCustomerId = 1;
        this.nextAdminId = 2;
        
        // Google OAuth configuration
        this.googleClientId = "your-google-client-id.apps.googleusercontent.com";
        
        // Main admin email
        this.mainAdminEmail = "admin@amyracollections.com";
        
        this.categories = {
            men: {
                name: "Men",
                subcategories: ["Jeans", "Pants", "Shirts", "Kurtas", "Formal"]
            },
            women: {
                name: "Women", 
                subcategories: ["Sarees", "Kurtis", "Tops", "Jeans", "Inners"]
            },
            kids: {
                name: "Kids",
                subcategories: ["Boys", "Girls"]
            },
            general: {
                name: "General",
                subcategories: ["Curtains", "Bedsheets", "Home Textiles"]
            }
        };

        this.sampleProducts = [
            {
                id: 1,
                name: "Premium Denim Jeans",
                category: "men",
                subcategory: "jeans",
                price: 2799,
                discount: 15,
                description: "High-quality denim jeans with perfect fit and premium finishing",
                images: [
                    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
                    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop"
                ],
                status: "active",
                stock: 25,
                sku: "AC-MJ-001",
                tags: ["denim", "casual", "premium"]
            },
            {
                id: 2,
                name: "Elegant Designer Kurti",
                category: "women",
                subcategory: "kurtis",
                price: 2199,
                discount: 20,
                description: "Beautiful hand-embroidered designer kurti for special occasions",
                images: [
                    "https://images.unsplash.com/photo-1583391733956-b7adceac7dd1?w=400&h=500&fit=crop",
                    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop"
                ],
                status: "active",
                stock: 15,
                sku: "AC-WK-002",
                tags: ["ethnic", "designer", "embroidered"]
            },
            {
                id: 3,
                name: "Formal Cotton Shirt",
                category: "men", 
                subcategory: "formal",
                price: 1499,
                discount: 10,
                description: "Premium cotton formal shirt perfect for office wear",
                images: [
                    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
                    "https://images.unsplash.com/photo-1603252109303-2751441bb4d2?w=400&h=500&fit=crop"
                ],
                status: "active",
                stock: 30,
                sku: "AC-MF-003",
                tags: ["formal", "cotton", "office"]
            },
            {
                id: 4,
                name: "Traditional Silk Saree",
                category: "women",
                subcategory: "sarees", 
                price: 5999,
                discount: 25,
                description: "Luxurious silk saree with intricate gold border work",
                images: [
                    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop",
                    "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=400&h=500&fit=crop"
                ],
                status: "active",
                stock: 8,
                sku: "AC-WS-004",
                tags: ["silk", "traditional", "wedding"]
            },
            {
                id: 5,
                name: "Kids Cartoon T-Shirt",
                category: "kids",
                subcategory: "boys",
                price: 899,
                discount: 5,
                description: "Fun cartoon printed t-shirt for active kids",
                images: [
                    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop",
                    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop"
                ],
                status: "active",
                stock: 20,
                sku: "AC-KB-005",
                tags: ["kids", "cartoon", "casual"]
            },
            {
                id: 6,
                name: "Luxury Bedsheet Set",
                category: "general",
                subcategory: "bedsheets",
                price: 1899,
                discount: 30,
                description: "Premium cotton bedsheet set with matching pillowcovers",
                images: [
                    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=500&fit=crop",
                    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=500&fit=crop"
                ],
                status: "active",
                stock: 12,
                sku: "AC-GB-006",
                tags: ["bedding", "cotton", "luxury"]
            }
        ];

        this.init();
    }

    init() {
        this.products = [...this.sampleProducts];
        this.filteredProducts = [...this.products.filter(p => p.status === 'active')];
        this.loadSampleData();
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.initializeGoogleAuth();
        this.bindEvents();
        this.renderProducts();
        this.updateCartBadge();
        this.showInterface('customer');
        
        // Make sure app is globally available
        window.app = this;
    }

    initializeGoogleAuth() {
        // Initialize Google Identity Services
        if (window.google && window.google.accounts) {
            this.setupGoogleSignIn();
        } else {
            // Wait for Google script to load or show fallback
            setTimeout(() => {
                this.showFallbackAuth();
            }, 2000);
        }
    }

    setupGoogleSignIn() {
        try {
            // Customer Google Sign-In
            const customerSignInDiv = document.getElementById('customerGoogleSignin');
            if (customerSignInDiv) {
                google.accounts.id.renderButton(customerSignInDiv, {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    width: 300,
                    click_listener: () => this.handleGoogleSignIn('customer')
                });
            }

            // Admin Google Sign-In
            const adminSignInDiv = document.getElementById('adminGoogleSignin');
            if (adminSignInDiv) {
                google.accounts.id.renderButton(adminSignInDiv, {
                    theme: 'filled_blue',
                    size: 'large',
                    text: 'signin',
                    width: 300,
                    click_listener: () => this.handleGoogleSignIn('admin')
                });
            }

            // Initialize Google Auth
            google.accounts.id.initialize({
                client_id: this.googleClientId,
                callback: (response) => this.handleGoogleResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true
            });

        } catch (error) {
            console.error('Error setting up Google Sign-In:', error);
            this.showFallbackAuth();
        }
    }

    showFallbackAuth() {
        // Fallback authentication for demo purposes
        const customerDiv = document.getElementById('customerGoogleSignin');
        const adminDiv = document.getElementById('adminGoogleSignin');
        
        if (customerDiv) {
            customerDiv.innerHTML = `
                <button class="btn btn--primary btn--full-width" onclick="window.app.demoCustomerLogin()">
                    <i class="fab fa-google"></i> Demo Customer Login
                </button>
            `;
        }
        
        if (adminDiv) {
            adminDiv.innerHTML = `
                <button class="btn btn--primary btn--full-width" onclick="window.app.demoAdminLogin()">
                    <i class="fab fa-google"></i> Demo Admin Login
                </button>
            `;
        }
    }

    demoCustomerLogin() {
        // Demo customer login
        const demoUser = {
            id: 'demo_customer_123',
            name: 'Demo Customer',
            email: 'customer@amyracollections.com',
            picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
            provider: 'google'
        };
        
        this.processUserLogin(demoUser, 'customer');
    }

    demoAdminLogin() {
        // Demo admin login
        const demoAdmin = {
            id: 'demo_admin_123',
            name: 'Main Admin',
            email: this.mainAdminEmail,
            picture: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
            provider: 'google'
        };
        
        this.processUserLogin(demoAdmin, 'admin');
    }

    handleGoogleSignIn(loginType) {
        this.pendingLoginType = loginType;
        google.accounts.id.prompt();
    }

    handleGoogleResponse(response) {
        try {
            // Decode JWT token
            const payload = this.decodeJWT(response.credential);
            
            const userData = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                provider: 'google'
            };

            this.processUserLogin(userData, this.pendingLoginType || 'customer');
            
        } catch (error) {
            console.error('Error handling Google response:', error);
            this.showNotification('Authentication failed. Please try again.', 'error');
        }
    }

    decodeJWT(token) {
        // Simple JWT decoder for demo purposes
        // In production, use a proper JWT library
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    processUserLogin(userData, loginType) {
        if (loginType === 'admin') {
            // Check if user is authorized admin
            if (this.isAuthorizedAdmin(userData.email)) {
                this.currentUser = userData;
                this.userType = 'admin';
                this.adminRole = userData.email === this.mainAdminEmail ? 'main_admin' : 'sub_admin';
                
                // Update admin user info
                const adminUserName = document.getElementById('adminUserName');
                if (adminUserName) {
                    adminUserName.textContent = userData.name;
                }
                
                this.showInterface('admin');
                this.closeModal('loginModal');
                this.showNotification(`Welcome, ${userData.name}! Admin access granted.`);
                this.updateAdminDashboard();
                this.updateAdminNavigation();
                
            } else {
                this.showNotification('Access denied. You are not authorized as an admin.', 'error');
            }
        } else {
            // Customer login
            this.currentUser = userData;
            this.userType = 'customer';
            
            // Add to customers if new
            if (!this.customers.find(c => c.email === userData.email)) {
                const newCustomer = {
                    id: this.nextCustomerId++,
                    name: userData.name,
                    email: userData.email,
                    phone: '',
                    joinDate: new Date(),
                    totalSpent: 0,
                    totalOrders: 0,
                    googleId: userData.id,
                    picture: userData.picture
                };
                this.customers.push(newCustomer);
            }
            
            this.updateUserInterface();
            this.closeModal('loginModal');
            this.showNotification(`Welcome back, ${userData.name}!`);
        }
    }

    isAuthorizedAdmin(email) {
        // Check if email is main admin or in admin list
        if (email === this.mainAdminEmail) return true;
        return this.admins.some(admin => admin.email === email && admin.status === 'active');
    }

    updateAdminNavigation() {
        const adminManagementLink = document.getElementById('adminManagementLink');
        if (adminManagementLink) {
            // Only main admin can see admin management
            if (this.adminRole === 'main_admin') {
                adminManagementLink.style.display = 'block';
            } else {
                adminManagementLink.style.display = 'none';
            }
        }
    }

    loadSampleData() {
        // Initialize admin list with main admin
        this.admins = [
            {
                id: 1,
                name: 'Main Administrator',
                email: this.mainAdminEmail,
                role: 'main_admin',
                addedDate: new Date(2024, 0, 1),
                addedBy: 'System',
                status: 'active'
            }
        ];

        // Add sample customers
        this.customers = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                phone: "+91 9876543210",
                joinDate: new Date(2024, 0, 15),
                totalSpent: 5299,
                totalOrders: 3,
                picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "+91 9876543211",
                joinDate: new Date(2024, 1, 20),
                totalSpent: 2199,
                totalOrders: 1,
                picture: 'https://images.unsplash.com/photo-1494790108755-2616c819e632?w=100&h=100&fit=crop&crop=face'
            }
        ];

        // Add sample orders
        this.orders = [
            {
                id: 1001,
                customerId: 1,
                customerName: "John Doe",
                customerEmail: "john@example.com",
                customerPhone: "+91 9876543210",
                items: [
                    { ...this.products[0], quantity: 1 },
                    { ...this.products[2], quantity: 2 }
                ],
                total: 4897,
                status: "delivered",
                date: new Date(2024, 2, 10),
                address: "123 Main St, City, State - 123456",
                paymentMethod: "upi"
            },
            {
                id: 1002,
                customerId: 2,
                customerName: "Jane Smith",
                customerEmail: "jane@example.com",
                customerPhone: "+91 9876543211",
                items: [
                    { ...this.products[1], quantity: 1 }
                ],
                total: 1899,
                status: "pending",
                date: new Date(2024, 8, 12),
                address: "456 Oak Ave, City, State - 123457",
                paymentMethod: "cod"
            }
        ];
        
        this.nextCustomerId = 3;
        this.nextOrderId = 1003;
    }

    bindEvents() {
        // Login modal events
        this.bindLoginEvents();
        
        // Navigation events - Use event delegation for better reliability
        document.addEventListener('click', (e) => {
            // Navigation links
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const category = e.target.dataset.category;
                this.filterByCategory(category);
            }
            
            // Category cards
            if (e.target.closest('.category-card')) {
                const card = e.target.closest('.category-card');
                const category = card.dataset.category;
                this.filterByCategory(category);
            }
            
            // Product cards
            if (e.target.closest('.product-card')) {
                const card = e.target.closest('.product-card');
                const productId = parseInt(card.dataset.productId);
                this.openProductModal(productId);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.applyFilters();
                }
            });
        }

        // Filter events
        this.bindFilterEvents();

        // Profile button events
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentUser) {
                    this.showUserMenu();
                } else {
                    this.openModal('loginModal');
                }
            });
        }

        // Cart button events
        const cartBtn = document.getElementById('cartBtn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCartModal();
            });
        }

        // Orders button events
        const ordersBtn = document.getElementById('ordersBtn');
        if (ordersBtn) {
            ordersBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showCustomerOrders();
            });
        }

        // Hero shop button
        const heroShopBtn = document.getElementById('heroShopBtn');
        if (heroShopBtn) {
            heroShopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Modal events
        this.bindModalEvents();

        // Admin events
        this.bindAdminEvents();
    }

    bindLoginEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = e.target.dataset.tab;
                this.switchLoginTab(tab);
            });
        });
    }

    switchLoginTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });

        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        if (tab === 'admin') {
            document.getElementById('adminLoginSection').classList.add('active');
        } else {
            document.getElementById('customerLoginSection').classList.add('active');
        }
    }

    updateUserInterface() {
        const profileText = document.getElementById('profileText');
        if (profileText && this.currentUser) {
            // Show just first name to save space
            const firstName = this.currentUser.name.split(' ')[0];
            profileText.textContent = firstName;
        }
    }

    showUserMenu() {
        // Simple implementation - show logout option
        if (confirm(`Hello ${this.currentUser.name}!\n\nDo you want to logout?`)) {
            this.logout();
        }
    }

    logout() {
        this.currentUser = null;
        this.userType = null;
        this.adminRole = null;
        this.cart = [];
        this.updateCartBadge();
        this.showInterface('customer');
        
        const profileText = document.getElementById('profileText');
        if (profileText) {
            profileText.textContent = 'Login';
        }
        
        this.showNotification('Logged out successfully!');
    }

    showInterface(type) {
        const customerInterface = document.getElementById('customerInterface');
        const adminInterface = document.getElementById('adminInterface');

        if (type === 'admin') {
            if (customerInterface) customerInterface.classList.add('hidden');
            if (adminInterface) adminInterface.classList.remove('hidden');
        } else {
            if (customerInterface) customerInterface.classList.remove('hidden');
            if (adminInterface) adminInterface.classList.add('hidden');
        }
    }

    bindFilterEvents() {
        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.currentPriceRange = e.target.value;
                this.applyFilters();
            });
        }

        const subcategoryFilter = document.getElementById('subcategoryFilter');
        if (subcategoryFilter) {
            subcategoryFilter.addEventListener('change', (e) => {
                this.currentSubcategory = e.target.value;
                this.applyFilters();
            });
        }

        const sortFilter = document.getElementById('sortFilter');
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }
    }

    bindModalEvents() {
        // Close modal events
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Checkout form
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }

        // Proceed to checkout
        const proceedToCheckout = document.getElementById('proceedToCheckout');
        if (proceedToCheckout) {
            proceedToCheckout.addEventListener('click', (e) => {
                e.preventDefault();
                if (!this.currentUser) {
                    this.showNotification('Please login to proceed with checkout');
                    this.closeModal('cartModal');
                    this.openModal('loginModal');
                    return;
                }
                this.openCheckoutModal();
            });
        }
    }

    bindAdminEvents() {
        // Admin navigation
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.showAdminSection(section);
            });
        });

        // Admin logout
        const adminLogoutBtn = document.getElementById('adminLogoutBtn');
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Add product button
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProductForm();
            });
        }

        // Product form
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }

        // Product category change for subcategories
        const productCategory = document.getElementById('productCategory');
        if (productCategory) {
            productCategory.addEventListener('change', (e) => {
                this.updateProductSubcategories(e.target.value);
            });
        }

        // Add admin button
        const addAdminBtn = document.getElementById('addAdminBtn');
        if (addAdminBtn) {
            addAdminBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.adminRole === 'main_admin') {
                    this.showAddAdminForm();
                } else {
                    this.showNotification('Only main admin can add new admins', 'error');
                }
            });
        }

        // Add admin form
        const addAdminForm = document.getElementById('addAdminForm');
        if (addAdminForm) {
            addAdminForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewAdmin();
            });
        }
    }

    // Admin functionality
    showAdminSection(section) {
        document.querySelectorAll('.admin-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const targetLink = document.querySelector(`[data-section="${section}"]`);
        const targetSection = document.getElementById(section);
        
        if (targetLink) targetLink.classList.add('active');
        if (targetSection) targetSection.classList.add('active');

        switch (section) {
            case 'dashboard':
                this.updateAdminDashboard();
                break;
            case 'products':
                this.renderAdminProducts();
                break;
            case 'orders':
                this.renderAdminOrders();
                break;
            case 'customers':
                this.renderAdminCustomers();
                break;
            case 'admins':
                if (this.adminRole === 'main_admin') {
                    this.renderAdminManagement();
                } else {
                    this.showNotification('Access denied. Only main admin can manage admins.', 'error');
                    this.showAdminSection('dashboard');
                }
                break;
        }
    }

    updateAdminDashboard() {
        const totalProducts = document.getElementById('totalProducts');
        const totalOrders = document.getElementById('totalOrders');
        const totalCustomers = document.getElementById('totalCustomers');
        const totalRevenue = document.getElementById('totalRevenue');
        
        if (totalProducts) totalProducts.textContent = this.products.filter(p => p.status === 'active').length;
        if (totalOrders) totalOrders.textContent = this.orders.length;
        if (totalCustomers) totalCustomers.textContent = this.customers.length;
        
        const revenue = this.orders.reduce((sum, order) => sum + order.total, 0);
        if (totalRevenue) totalRevenue.textContent = `₹${revenue.toLocaleString()}`;
    }

    renderAdminProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>
                    <div class="product-image-cell">
                        <img src="${product.images ? product.images[0] : product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'}" 
                             alt="${product.name}" 
                             onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'; this.onerror=null;">
                    </div>
                </td>
                <td>${product.name}</td>
                <td>${this.categories[product.category]?.name || product.category}</td>
                <td>₹${product.price.toLocaleString()}</td>
                <td>${product.stock}</td>
                <td>
                    <span class="status-badge status-${product.status}">
                        ${product.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--sm btn--outline" onclick="window.app.editProduct(${product.id})">Edit</button>
                        <button class="btn btn--sm btn--danger" onclick="window.app.deleteProduct(${product.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderAdminOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName}</td>
                <td>${order.date.toLocaleDateString()}</td>
                <td>₹${order.total.toLocaleString()}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        ${order.status}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn--sm btn--outline" onclick="window.app.viewOrderDetails(${order.id})">View</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderAdminCustomers() {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.totalOrders}</td>
                <td>₹${customer.totalSpent.toLocaleString()}</td>
                <td>${customer.joinDate.toLocaleDateString()}</td>
            </tr>
        `).join('');
    }

    renderAdminManagement() {
        const tbody = document.getElementById('adminsTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.admins.map(admin => `
            <tr>
                <td>${admin.name}</td>
                <td>${admin.email}</td>
                <td>
                    <span class="status-badge status-${admin.role.replace('_', '-')}">
                        ${admin.role === 'main_admin' ? 'Main Admin' : 'Sub Admin'}
                    </span>
                </td>
                <td>${admin.addedDate.toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        ${admin.role !== 'main_admin' ? `
                            <button class="btn btn--sm btn--danger" onclick="window.app.removeAdmin(${admin.id})">Remove</button>
                        ` : `
                            <span class="badge">System Admin</span>
                        `}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showAddAdminForm() {
        this.openModal('addAdminModal');
    }

    addNewAdmin() {
        const email = document.getElementById('adminEmail')?.value || '';
        const name = document.getElementById('adminName')?.value || '';
        const role = document.getElementById('adminRole')?.value || 'sub_admin';

        if (!email || !name) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        // Check if admin already exists
        if (this.admins.find(admin => admin.email === email)) {
            this.showNotification('Admin with this email already exists', 'error');
            return;
        }

        const newAdmin = {
            id: this.nextAdminId++,
            name,
            email,
            role,
            addedDate: new Date(),
            addedBy: this.currentUser.name,
            status: 'active'
        };

        this.admins.push(newAdmin);
        this.closeModal('addAdminModal');
        this.renderAdminManagement();
        this.showNotification(`Admin ${name} added successfully!`);
        
        // Reset form
        const form = document.getElementById('addAdminForm');
        if (form) form.reset();
    }

    removeAdmin(adminId) {
        if (confirm('Are you sure you want to remove this admin?')) {
            const admin = this.admins.find(a => a.id === adminId);
            if (admin && admin.role !== 'main_admin') {
                this.admins = this.admins.filter(a => a.id !== adminId);
                this.renderAdminManagement();
                this.showNotification(`Admin ${admin.name} removed successfully!`);
            }
        }
    }

    showProductForm(productId = null) {
        const isEdit = !!productId;
        const product = isEdit ? this.products.find(p => p.id === productId) : null;
        
        const productFormTitle = document.getElementById('productFormTitle');
        if (productFormTitle) {
            productFormTitle.textContent = isEdit ? 'Edit Product' : 'Add New Product';
        }
        
        // Reset form
        const form = document.getElementById('productForm');
        if (form) form.reset();
        
        // Fill form if editing
        if (product) {
            const elements = {
                productName: product.name,
                productPrice: product.price,
                productCategory: product.category,
                productDescription: product.description,
                productStock: product.stock,
                productImage: product.images ? product.images[0] : (product.image || ''),
                productStatus: product.status
            };
            
            Object.keys(elements).forEach(id => {
                const element = document.getElementById(id);
                if (element) element.value = elements[id];
            });
            
            this.updateProductSubcategories(product.category);
            setTimeout(() => {
                const subcategoryEl = document.getElementById('productSubcategory');
                if (subcategoryEl) {
                    subcategoryEl.value = product.subcategory.toLowerCase();
                }
            }, 100);
        }
        
        // Store product ID for editing
        if (form) form.dataset.editId = productId || '';
        
        this.openModal('productFormModal');
    }

    updateProductSubcategories(category) {
        const subcategorySelect = document.getElementById('productSubcategory');
        if (!subcategorySelect) return;

        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
        
        if (category && this.categories[category]) {
            this.categories[category].subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.toLowerCase();
                option.textContent = sub;
                subcategorySelect.appendChild(option);
            });
        }
    }

    saveProduct() {
        const form = document.getElementById('productForm');
        if (!form) return;
        
        const editId = form.dataset.editId;
        
        const productData = {
            name: document.getElementById('productName')?.value || '',
            price: parseInt(document.getElementById('productPrice')?.value || 0),
            category: document.getElementById('productCategory')?.value || '',
            subcategory: document.getElementById('productSubcategory')?.value || '',
            description: document.getElementById('productDescription')?.value || '',
            stock: parseInt(document.getElementById('productStock')?.value || 0),
            images: [document.getElementById('productImage')?.value || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'],
            status: document.getElementById('productStatus')?.value || 'active',
            sku: `AC-${(productData.category?.charAt(0) || 'P').toUpperCase()}${(productData.subcategory?.charAt(0) || 'R').toUpperCase()}-${String(Date.now()).slice(-3)}`
        };

        if (editId) {
            // Edit existing product
            const productIndex = this.products.findIndex(p => p.id === parseInt(editId));
            if (productIndex !== -1) {
                this.products[productIndex] = { ...this.products[productIndex], ...productData };
                this.showNotification('Product updated successfully!');
            }
        } else {
            // Add new product
            const newProduct = {
                id: this.nextProductId++,
                ...productData,
                tags: [productData.category, productData.subcategory]
            };
            this.products.push(newProduct);
            this.showNotification('Product added successfully!');
        }

        this.closeModal('productFormModal');
        this.renderAdminProducts();
        this.updateAdminDashboard();
        
        // Update customer view
        this.applyFilters();
    }

    editProduct(productId) {
        this.showProductForm(productId);
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.renderAdminProducts();
            this.updateAdminDashboard();
            this.applyFilters();
            this.showNotification('Product deleted successfully!');
        }
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        let details = `Order #${order.id}\n\n`;
        details += `Customer: ${order.customerName}\n`;
        details += `Email: ${order.customerEmail}\n`;
        details += `Phone: ${order.customerPhone}\n`;
        details += `Address: ${order.address}\n`;
        details += `Payment: ${order.paymentMethod.toUpperCase()}\n`;
        details += `Status: ${order.status.toUpperCase()}\n`;
        details += `Date: ${order.date.toLocaleDateString()}\n\n`;
        details += `Items:\n`;
        order.items.forEach(item => {
            details += `- ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}\n`;
        });
        details += `\nTotal: ₹${order.total.toLocaleString()}`;

        alert(details);
    }

    // Customer functionality
    filterByCategory(category) {
        this.currentCategory = category;
        this.currentSubcategory = 'all';
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.category === category) {
                link.classList.add('active');
            }
        });

        // Update subcategory options
        this.updateSubcategoryOptions();
        
        // Apply filters
        this.applyFilters();

        // Scroll to products section
        const productsSection = document.querySelector('.products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    updateSubcategoryOptions() {
        const subcategoryFilter = document.getElementById('subcategoryFilter');
        if (!subcategoryFilter) return;

        subcategoryFilter.innerHTML = '<option value="all">All Items</option>';
        
        if (this.currentCategory !== 'all' && this.categories[this.currentCategory]) {
            this.categories[this.currentCategory].subcategories.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.toLowerCase();
                option.textContent = sub;
                subcategoryFilter.appendChild(option);
            });
        }
    }

    applyFilters() {
        let filtered = this.products.filter(p => p.status === 'active');

        // Category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(product => product.category === this.currentCategory);
        }

        // Subcategory filter
        if (this.currentSubcategory !== 'all') {
            filtered = filtered.filter(product => 
                product.subcategory.toLowerCase() === this.currentSubcategory
            );
        }

        // Price filter
        if (this.currentPriceRange !== 'all') {
            filtered = filtered.filter(product => {
                switch (this.currentPriceRange) {
                    case '0-1000':
                        return product.price <= 1000;
                    case '1000-2000':
                        return product.price > 1000 && product.price <= 2000;
                    case '2000-3000':
                        return product.price > 2000 && product.price <= 3000;
                    case '3000+':
                        return product.price > 3000;
                    default:
                        return true;
                }
            });
        }

        // Search filter
        if (this.searchQuery) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.searchQuery) ||
                product.subcategory.toLowerCase().includes(this.searchQuery) ||
                product.description.toLowerCase().includes(this.searchQuery)
            );
        }

        // Apply sorting
        this.sortProducts(filtered);

        this.filteredProducts = filtered;
        this.renderProducts();
        this.updateProductsTitle();
    }

    sortProducts(products) {
        switch (this.currentSort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                products.sort((a, b) => b.id - a.id);
                break;
            default: // popularity
                products.sort((a, b) => a.id - b.id);
                break;
        }
    }

    updateProductsTitle() {
        const title = document.getElementById('productsTitle');
        if (!title) return;

        let titleText = 'Featured Products';
        
        if (this.currentCategory !== 'all') {
            const categoryName = this.categories[this.currentCategory]?.name || this.currentCategory;
            titleText = `${categoryName}'s Collection`;
        }

        if (this.searchQuery) {
            titleText = `Search Results for "${this.searchQuery}"`;
        }

        title.textContent = titleText;
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');
        
        if (!productsGrid || !noProducts) return;

        if (this.filteredProducts.length === 0) {
            productsGrid.style.display = 'none';
            noProducts.style.display = 'block';
            return;
        }

        productsGrid.style.display = 'grid';
        noProducts.style.display = 'none';
        
        productsGrid.innerHTML = this.filteredProducts.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const imageUrl = product.images ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'; this.onerror=null;">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">₹${product.price.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;
    }

    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const imageUrl = product.images ? product.images[0] : (product.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');

        const modalProductImage = document.getElementById('modalProductImage');
        const modalProductName = document.getElementById('modalProductName');
        const modalProductDescription = document.getElementById('modalProductDescription');
        const modalCurrentPrice = document.getElementById('modalCurrentPrice');

        if (modalProductImage) {
            modalProductImage.src = imageUrl;
            modalProductImage.onerror = function() {
                this.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                this.onerror = null;
            };
        }
        if (modalProductName) modalProductName.textContent = product.name;
        if (modalProductDescription) modalProductDescription.textContent = product.description;
        if (modalCurrentPrice) modalCurrentPrice.textContent = `₹${product.price.toLocaleString()}`;
        
        // Update modal button with product ID
        const modalAddToCart = document.getElementById('modalAddToCart');
        if (modalAddToCart) {
            // Remove existing event listener
            modalAddToCart.replaceWith(modalAddToCart.cloneNode(true));
            const newModalAddToCart = document.getElementById('modalAddToCart');
            
            newModalAddToCart.addEventListener('click', () => {
                this.addToCart(productId);
                this.closeModal('productModal');
            });
        }

        this.openModal('productModal');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                this.showNotification(`${product.name} quantity updated in cart!`);
            } else {
                this.showNotification('Sorry, insufficient stock available!', 'error');
                return;
            }
        } else {
            if (product.stock > 0) {
                this.cart.push({
                    ...product,
                    quantity: 1
                });
                this.showNotification(`${product.name} added to cart!`);
            } else {
                this.showNotification('Sorry, this product is out of stock!', 'error');
                return;
            }
        }

        this.updateCartBadge();
    }

    updateCartBadge() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    openCartModal() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartFooter = document.getElementById('cartFooter');
        
        if (!cartItems || !cartEmpty || !cartFooter) return;
        
        if (this.cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
            cartFooter.style.display = 'none';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            cartFooter.style.display = 'block';
            
            this.renderCartItems();
            this.updateCartTotal();
        }

        this.openModal('cartModal');
    }

    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        if (!cartItems) return;

        cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
        this.bindCartEvents();
    }

    createCartItem(item) {
        const imageUrl = item.images ? item.images[0] : (item.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop');
        
        return `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'; this.onerror=null;">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-btn" data-product-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" readonly>
                            <button class="quantity-btn increase-btn" data-product-id="${item.id}">+</button>
                        </div>
                        <button class="cart-remove-btn" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindCartEvents() {
        // Increase quantity
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.productId);
                this.updateCartItemQuantity(productId, 1);
            });
        });

        // Decrease quantity
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.productId);
                this.updateCartItemQuantity(productId, -1);
            });
        });

        // Remove item
        document.querySelectorAll('.cart-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.productId);
                this.removeFromCart(productId);
            });
        });
    }

    updateCartItemQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        const product = this.products.find(p => p.id === productId);
        if (!item || !product) return;

        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
        } else if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
            this.renderCartItems();
            this.updateCartTotal();
            this.updateCartBadge();
        } else {
            this.showNotification('Insufficient stock available!', 'error');
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        
        if (this.cart.length === 0) {
            this.openCartModal(); // Refresh to show empty state
        } else {
            this.renderCartItems();
            this.updateCartTotal();
        }
        
        this.updateCartBadge();
    }

    updateCartTotal() {
        const subtotal = this.cart.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartTotal = document.getElementById('cartTotal');
        
        if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toLocaleString()}`;
        if (cartTotal) cartTotal.textContent = `₹${subtotal.toLocaleString()}`;
    }

    openCheckoutModal() {
        const checkoutTotal = document.getElementById('checkoutTotal');
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (checkoutTotal) {
            checkoutTotal.textContent = `₹${subtotal.toLocaleString()}`;
        }

        // Pre-fill user data if available
        if (this.currentUser) {
            const checkoutName = document.getElementById('checkoutName');
            if (checkoutName) checkoutName.value = this.currentUser.name;
        }

        this.closeModal('cartModal');
        this.openModal('checkoutModal');
    }

    processOrder() {
        if (!this.currentUser) {
            this.showNotification('Please login to place an order!', 'error');
            return;
        }

        const name = document.getElementById('checkoutName')?.value || '';
        const phone = document.getElementById('checkoutPhone')?.value || '';
        const address = document.getElementById('checkoutAddress')?.value || '';
        const paymentMethod = document.getElementById('paymentMethod')?.value || '';

        if (!name || !phone || !address || !paymentMethod) {
            this.showNotification('Please fill all required fields!', 'error');
            return;
        }

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const newOrder = {
            id: this.nextOrderId++,
            customerId: this.currentUser.id,
            customerName: name,
            customerEmail: this.currentUser.email,
            customerPhone: phone,
            items: [...this.cart],
            total: subtotal,
            status: paymentMethod === 'cod' ? 'pending' : 'pending',
            date: new Date(),
            address,
            paymentMethod
        };

        this.orders.push(newOrder);

        // Update customer stats
        const customer = this.customers.find(c => c.email === this.currentUser.email);
        if (customer) {
            customer.totalOrders += 1;
            customer.totalSpent += subtotal;
        }

        // Update product stock
        this.cart.forEach(cartItem => {
            const product = this.products.find(p => p.id === cartItem.id);
            if (product) {
                product.stock -= cartItem.quantity;
            }
        });

        // Clear cart
        this.cart = [];
        this.updateCartBadge();

        this.closeModal('checkoutModal');
        
        // Show success message
        this.showNotification(`Order #${newOrder.id} placed successfully! You will receive a confirmation shortly.`, 'success');
    }

    showCustomerOrders() {
        if (!this.currentUser) {
            this.showNotification('Please login to view your orders!', 'error');
            this.openModal('loginModal');
            return;
        }

        const customerOrders = this.orders.filter(order => order.customerEmail === this.currentUser.email);
        
        if (customerOrders.length === 0) {
            this.showNotification('You have no orders yet. Start shopping!');
            return;
        }

        let ordersText = 'Your Orders:\n\n';
        customerOrders.forEach(order => {
            ordersText += `Order #${order.id}\n`;
            ordersText += `Date: ${order.date.toLocaleDateString()}\n`;
            ordersText += `Status: ${order.status.toUpperCase()}\n`;
            ordersText += `Total: ₹${order.total.toLocaleString()}\n`;
            ordersText += `Items: ${order.items.length} item(s)\n\n`;
        });

        alert(ordersText);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === 'error' ? 'var(--color-error)' : type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'};
            color: var(--color-btn-primary-text);
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
        
        // Add slide-out animation
        style.textContent += `
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
    }
}

// Initialize the application
let app;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new AmyraCollections();
        window.app = app;
    });
} else {
    app = new AmyraCollections();
    window.app = app;
}