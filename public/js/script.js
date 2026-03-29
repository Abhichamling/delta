/* Root Variables - Clean Black & White with Brown Accent */
:root {
    --black: #000000;
    --dark-gray: #333333;
    --medium-gray: #666666;
    --light-gray: #999999;
    --lighter-gray: #EEEEEE;
    --white: #FFFFFF;
    --border-color: #DDDDDD;
    --bg-light: #F8F8F8;
    --danger: #dc3545;
    --success: #28a745;
    --warning: #ffc107;
    --brown: #8B5A2B;
    --brown-dark: #6B4A2B;
}

/* Global Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: var(--black);
    background-color: var(--white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    line-height: 1.5;
}

/* Container Spacing */
.container-fluid {
    padding-left: 2rem;
    padding-right: 2rem;
}

@media (min-width: 1400px) {
    .container-fluid {
        padding-left: 5rem;
        padding-right: 5rem;
    }
}

/* ========== NAVBAR STYLES ========== */
.navbar {
    background-color: var(--white) !important;
    box-shadow: 0 1px 5px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
    padding: 1rem 0;
}

.navbar.navbar-scrolled {
    padding: 0.6rem 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.navbar-brand {
    font-weight: 600;
    letter-spacing: -0.5px;
    color: var(--black) !important;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.navbar-brand i {
    color: var(--black);
    font-size: 2rem;
}

.navbar-nav {
    gap: 1.5rem;
}

.nav-link {
    color: var(--black) !important;
    font-weight: 500;
    padding: 0.5rem 0 !important;
}

/* ========== SEARCH BAR ========== */
.search-full, .search-compact {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

.search-full .border,
.search-compact .border {
    border: 1px solid var(--border-color) !important;
    background-color: var(--white);
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.search-full .d-flex {
    padding: 0.6rem 1.5rem;
    gap: 1.5rem;
}

.search-full span {
    color: var(--black);
    font-size: 0.9rem;
}

.search-full .text-muted {
    color: var(--medium-gray) !important;
}

.search-full .rounded-circle {
    background-color: var(--black) !important;
    width: 36px;
    height: 36px;
}

/* ========== CATEGORY FILTERS - FIXED POSITION ========== */
.category-filters {
    position: sticky;
    top: 80px;
    z-index: 999;
    background-color: var(--white);
    padding: 1.2rem 0;
    border-bottom: 1px solid var(--border-color);
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
}

.category-filters::-webkit-scrollbar {
    display: none;
}

.category-filters .container-fluid {
    padding-left: 2rem;
    padding-right: 2rem;
}

.category-filters .d-flex {
    display: flex;
    gap: 3rem;
    align-items: center;
    justify-content: flex-start;
    min-width: max-content;
    padding-bottom: 0;
}

/* Category Item - No Movement */
.category-item {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--medium-gray);
    font-size: 0.8rem;
    gap: 0.8rem;
    min-width: 80px;
    padding: 0.5rem 0 0.8rem 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
    cursor: pointer;
}

.category-item i {
    font-size: 1.8rem;
    color: var(--medium-gray);
    transition: color 0.2s ease;
}

.category-item span {
    font-weight: 500;
    letter-spacing: 0.3px;
    transition: color 0.2s ease;
}

/* Hover Effects - Only Color Changes */
.category-item:hover {
    color: var(--black);
}

.category-item:hover i {
    color: var(--black);
}

/* Active State */
.category-item.active {
    color: var(--black);
    border-bottom-color: var(--black);
}

.category-item.active i {
    color: var(--black);
}

.category-item.active span {
    color: var(--black);
    font-weight: 600;
}

/* Navbar scroll effect on category filters */
.navbar-scrolled + .category-filters {
    top: 60px;
}

/* ========== PAGE HEADER ========== */
.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0 1.5rem 0;
}

.page-header h2 {
    font-size: 1.8rem;
    font-weight: 300;
    letter-spacing: -0.5px;
}

.page-header h2 i {
    margin-right: 0.8rem;
    color: var(--black);
}

.page-header .text-muted {
    color: var(--medium-gray) !important;
    font-size: 1rem;
    margin-left: 0.8rem;
}

/* ========== LISTINGS GRID ========== */
.listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    margin: 2rem 0 3rem 0;
}

/* Listing Card */
.listing-card {
    transition: transform 0.3s ease;
    background: var(--white);
    border: none;
    cursor: pointer;
    width: 100%;
}

.listing-card:hover {
    transform: translateY(-8px);
}

.listing-card .image-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    overflow: hidden;
    border-radius: 16px;
    margin-bottom: 0.8rem;
}

.listing-card .card-img-top {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.listing-card:hover .card-img-top {
    transform: scale(1.05);
}

/* Like Button */
.like-btn {
    position: absolute;
    top: 12px;
    right: 12px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255,255,255,0.9);
    border-radius: 50%;
    color: var(--black) !important;
    border: none;
    transition: all 0.2s ease;
    z-index: 10;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.like-btn:hover {
    background-color: var(--white);
    transform: scale(1.1);
}

.like-btn i {
    font-size: 1.2rem;
}

/* Category Badge */
.category-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background-color: var(--black) !important;
    color: var(--white) !important;
    font-size: 0.7rem;
    padding: 0.4rem 1rem;
    border-radius: 50px;
    font-weight: 500;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Card Content */
.listing-card .card-body {
    padding: 0;
}

.listing-card .location {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--black);
    margin-bottom: 0.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.listing-card .rating {
    font-size: 0.9rem;
    color: var(--black);
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.listing-card .rating i {
    color: var(--black);
    font-size: 0.8rem;
}

.listing-card .title {
    font-size: 0.9rem;
    color: var(--medium-gray);
    margin-bottom: 0.3rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.listing-card .details {
    font-size: 0.9rem;
    color: var(--medium-gray);
    margin-bottom: 0.5rem;
}

.listing-card .price {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 1rem;
}

.listing-card .price .amount {
    font-weight: 700;
    color: var(--black);
}

.listing-card .price .period {
    color: var(--medium-gray);
    font-size: 0.9rem;
}

/* ========== DROPDOWN MENU ========== */
.dropdown-menu {
    border: none;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    border-radius: 12px;
    padding: 0.5rem 0;
    min-width: 240px;
}

.dropdown-item {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
    color: var(--black);
    transition: all 0.2s ease;
}

.dropdown-item:hover {
    background-color: var(--bg-light);
    color: var(--black);
}

.dropdown-item i {
    width: 1.5rem;
    color: var(--black);
}

.dropdown-item.active {
    background-color: var(--black) !important;
    color: var(--white) !important;
}

.dropdown-divider {
    border-top-color: var(--border-color);
    margin: 0.5rem 0;
}

/* ========== DIFFICULTY FILTER ========== */
.difficulty-filter {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.difficulty-filter .btn-outline-secondary {
    border-color: var(--border-color);
    color: var(--black);
    padding: 0.5rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 50px;
}

.difficulty-filter .btn-outline-secondary:hover {
    background-color: var(--bg-light);
    border-color: var(--black);
}

.difficulty-filter .btn-outline-secondary.active {
    background-color: var(--black);
    color: var(--white);
    border-color: var(--black);
}

/* ========== ALERT MESSAGES ========== */
.alert {
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: var(--white);
    color: var(--black);
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
    animation: slideDown 0.3s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

@keyframes slideDown {
    from {
        transform: translateY(-100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.alert-success,
.alert-danger {
    border-left: 4px solid var(--black);
}

.alert i {
    margin-right: 0.8rem;
    color: var(--black);
}

/* ========== FOOTER ========== */
footer {
    background-color: var(--white);
    border-top: 1px solid var(--border-color);
    margin-top: auto;
    padding: 3rem 0 2rem 0;
}

footer .row {
    margin-bottom: 2rem;
}

footer h5 {
    color: var(--black);
    font-weight: 600;
    margin-bottom: 1.2rem;
    font-size: 1.1rem;
}

footer h6 {
    color: var(--black);
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1rem;
}

footer a {
    color: var(--medium-gray);
    transition: color 0.2s ease;
    text-decoration: none;
    display: inline-block;
    margin-bottom: 0.5rem;
}

footer a:hover {
    color: var(--black) !important;
}

footer .social-links {
    display: flex;
    gap: 1.2rem;
    font-size: 1.4rem;
}

footer .social-links a {
    color: var(--medium-gray);
}

footer hr {
    border-top-color: var(--border-color);
    margin: 2rem 0;
}

footer .copyright {
    color: var(--medium-gray);
    font-size: 0.9rem;
    text-align: center;
}

/* ========== FORM CONTROLS ========== */
.form-control, .form-select {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 0.7rem 1.2rem;
    transition: all 0.2s ease;
    color: var(--black);
}

.form-control:focus, .form-select:focus {
    border-color: var(--black);
    box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.05);
    outline: none;
}

.form-label {
    color: var(--black);
    font-weight: 500;
    margin-bottom: 0.5rem;
}

/* ========== BUTTONS ========== */
.btn-primary {
    background-color: var(--black) !important;
    border-color: var(--black) !important;
    color: var(--white) !important;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background-color: var(--dark-gray) !important;
    border-color: var(--dark-gray) !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-outline-secondary {
    border-color: var(--border-color);
    color: var(--black);
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
}

.btn-outline-secondary:hover {
    background-color: var(--bg-light);
    border-color: var(--black);
    color: var(--black);
}

/* ========== EMPTY STATE ========== */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
}

.empty-state i {
    font-size: 4rem;
    color: var(--light-gray);
    margin-bottom: 1.5rem;
}

.empty-state h3 {
    color: var(--black);
    font-weight: 300;
    margin-bottom: 1.5rem;
}

.empty-state .btn {
    padding: 0.8rem 2rem;
}

/* ========== ANIMATIONS ========== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(15px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.listing-card {
    animation: fadeIn 0.5s ease forwards;
}

/* Loading State */
.loading {
    opacity: 0.5;
    pointer-events: none;
}

/* ========== SCROLLBAR ========== */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: var(--bg-light);
}

::-webkit-scrollbar-thumb {
    background: var(--light-gray);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--medium-gray);
}

/* ========== LISTING FORM & EDIT FORM SHARED STYLES ========== */

/* Category Grid */
.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;
    padding: 15px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    background-color: var(--white);
}

/* Category Checkbox Styles */
.category-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
    transition: background-color 0.2s;
    background-color: var(--bg-light);
    border: 1px solid var(--border-color);
}

.category-checkbox:hover {
    background-color: var(--lighter-gray);
}

.category-checkbox input[type="checkbox"] {
    margin-right: 10px;
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--black);
}

.category-item {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--black);
}

/* Category Count Display */
#category-count {
    transition: color 0.2s ease;
}

#category-count.text-danger {
    color: var(--danger) !important;
    font-weight: 600;
}

/* Scrollbar for Category Grid */
.category-grid::-webkit-scrollbar {
    width: 8px;
}

.category-grid::-webkit-scrollbar-track {
    background: var(--bg-light);
    border-radius: 10px;
}

.category-grid::-webkit-scrollbar-thumb {
    background: var(--light-gray);
    border-radius: 10px;
}

.category-grid::-webkit-scrollbar-thumb:hover {
    background: var(--medium-gray);
}

/* Price Input Group */
.input-group-text {
    border-radius: 0.375rem 0 0 0.375rem;
    background-color: var(--bg-light);
    border: 1px solid var(--border-color);
    color: var(--black);
}

/* Tab Styles */
.nav-pills .nav-link {
    color: var(--medium-gray);
    border-radius: 50px;
    padding: 8px 20px;
    transition: all 0.2s ease;
}

.nav-pills .nav-link:hover {
    background-color: var(--bg-light);
    color: var(--black);
}

.nav-pills .nav-link.active {
    background-color: var(--black);
    color: var(--white);
}

.nav-pills .nav-link:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.1);
}

/* Link Container */
#link-container {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 10px;
}

#link-container::-webkit-scrollbar {
    width: 8px;
}

#link-container::-webkit-scrollbar-track {
    background: var(--bg-light);
    border-radius: 10px;
}

#link-container::-webkit-scrollbar-thumb {
    background: var(--light-gray);
    border-radius: 10px;
}

#link-container::-webkit-scrollbar-thumb:hover {
    background: var(--medium-gray);
}

/* Form Card Styles */
.listing-form-card {
    border: 0;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    border-radius: 1rem;
    padding: 1.5rem;
}

/* Photo Section */
.photo-section {
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 1.5rem;
    background-color: var(--bg-light);
}

/* Image Preview Styles */
.preview-image {
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid var(--border-color);
    background: var(--bg-light);
    transition: transform 0.2s ease;
}

.preview-image:hover {
    transform: scale(1.02);
}

.preview-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-image .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    color: var(--danger);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-image .remove-btn:hover {
    background: var(--danger);
    color: var(--white);
    transform: scale(1.1);
}

.preview-image .remove-btn:focus {
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.5);
}

/* File Size Badge */
.file-size-badge {
    font-size: 8px;
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 4px;
}

/* File Size Warning */
.file-size-warning {
    color: #856404;
    background-color: #fff3cd;
    border: 1px solid #ffeeba;
    border-radius: 4px;
    padding: 8px 12px;
    margin-top: 8px;
    font-size: 0.9rem;
}

/* Compression Status */
.compressing-message {
    color: #004085;
    background-color: #cce5ff;
    border: 1px solid #b8daff;
    border-radius: 4px;
    padding: 8px 12px;
    margin-top: 8px;
    font-size: 0.9rem;
}

/* Alert Styles */
.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
    border-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
    margin-top: 0.5rem;
}

.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
    border-radius: 0.5rem;
    padding: 0.75rem 1.25rem;
    margin-top: 0.5rem;
}

/* Badge Styles */
.badge.bg-secondary {
    background-color: var(--medium-gray) !important;
    color: var(--white) !important;
}

.badge.bg-warning {
    background-color: var(--warning) !important;
    color: var(--black) !important;
}

.badge.bg-success {
    background-color: var(--success) !important;
}

.badge.bg-light {
    background-color: var(--bg-light) !important;
    color: var(--black) !important;
    font-weight: normal;
}

/* Image Counter Badge States */
#imageCount.badge.bg-danger {
    background-color: var(--danger) !important;
}

#imageCount.badge.bg-warning {
    background-color: var(--warning) !important;
    color: var(--black) !important;
}

#imageCount.badge.bg-success {
    background-color: var(--success) !important;
}

/* Current Image Styles */
.current-image {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
}

.current-image img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border: 1px solid var(--border-color);
}

.current-image .default-image {
    max-width: 200px;
}

/* ========== LISTING SHOW PAGE STYLES ========== */

/* Thumbnail Gallery Styles */
.thumbnail-item img.active-thumbnail {
    border: 2px solid var(--brown) !important;
}

.thumbnail-gallery {
    margin-top: 20px;
}

.thumbnail-item {
    transition: transform 0.2s;
    cursor: pointer;
}

.thumbnail-item:hover {
    transform: scale(1.05);
}

.thumbnail-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border: 2px solid transparent;
    transition: border-color 0.2s;
}

/* Main Image Container */
.main-image-container {
    background-color: var(--bg-light);
    border-radius: 12px;
    padding: 10px;
    display: inline-block;
    width: 100%;
}

.main-image-container img {
    transition: opacity 0.3s;
    max-width: 100%;
    max-height: 450px;
    width: auto;
    height: auto;
    object-fit: contain;
    cursor: pointer;
}

.main-image-container img:hover {
    opacity: 0.95;
}

/* Carousel Controls */
.carousel-control-prev-icon,
.carousel-control-next-icon {
    background-size: 60%;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.carousel-control-prev-icon.bg-dark,
.carousel-control-next-icon.bg-dark {
    background-color: var(--dark-gray);
    border-radius: 50%;
    padding: 1rem;
}

/* Modal Styles */
.modal-content {
    border: none;
    border-radius: 16px;
}

.modal-header {
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 1.5rem;
}

.modal-body {
    padding: 1.5rem;
}

.modal-title i {
    margin-right: 0.5rem;
}

/* Experience Highlights */
.highlight-icon {
    color: var(--brown);
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
}

/* Activity Badges */
.badge.rounded-pill.bg-light {
    background-color: var(--bg-light) !important;
    color: var(--black) !important;
    padding: 0.5rem 1rem;
    font-weight: 500;
}

.badge.rounded-pill.bg-light i {
    color: var(--brown);
    margin-right: 0.25rem;
}

/* Review Cards */
.card.border-0.bg-light.rounded-4 {
    border: none;
    background-color: var(--bg-light);
    border-radius: 1rem !important;
    transition: transform 0.2s;
}

.card.border-0.bg-light.rounded-4:hover {
    transform: translateY(-2px);
}

/* Booking Card */
.card.sticky-top {
    top: 100px;
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.card.sticky-top .btn[style*="background-color: #8B5A2B"] {
    background-color: var(--brown);
    border: none;
    transition: background-color 0.2s;
}

.card.sticky-top .btn[style*="background-color: #8B5A2B"]:hover {
    background-color: var(--brown-dark) !important;
}

/* Price Breakdown */
.border-top.pt-3 .d-flex {
    font-size: 0.9rem;
}

.border-top.pt-3 .fw-bold {
    font-size: 1rem;
}

/* Host Info */
.host-image {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 50%;
}

/* Review Form */
.bg-light.rounded-4.p-4 {
    background-color: var(--bg-light);
    border-radius: 1rem !important;
}

.form-select.form-select-sm.rounded-pill {
    border-radius: 50rem !important;
    padding: 0.5rem 1rem;
}

/* Custom Color Utilities */
.text-brown {
    color: var(--brown) !important;
}

.bg-brown {
    background-color: var(--brown) !important;
}

.border-brown {
    border-color: var(--brown) !important;
}

/* Link Styles */
.btn-link.text-decoration-none {
    color: var(--brown);
    transition: color 0.2s;
}

.btn-link.text-decoration-none:hover {
    color: var(--brown-dark);
    text-decoration: underline !important;
}

/* Delete Button */
.btn-sm.text-danger.p-0 {
    background: none;
    border: none;
    transition: opacity 0.2s;
}

.btn-sm.text-danger.p-0:hover {
    opacity: 0.7;
}

/* Icon Colors */
.fa-medal,
.fa-location-dot,
.fa-tag,
.fa-chart-line {
    color: var(--brown);
}

/* ========== RESPONSIVE DESIGN ========== */
@media (min-width: 1400px) {
    .category-filters .d-flex {
        gap: 3.5rem;
    }
}

@media (max-width: 1200px) {
    .listings-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.8rem;
    }
}

@media (max-width: 992px) {
    .container-fluid {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
    
    .category-filters {
        top: 70px;
    }
    
    .navbar-scrolled + .category-filters {
        top: 55px;
    }
    
    .category-filters .d-flex {
        gap: 2.5rem;
    }
    
    .category-item {
        min-width: 70px;
        gap: 0.6rem;
    }
    
    .category-item i {
        font-size: 1.6rem;
    }
}

@media (max-width: 768px) {
    .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    
    .category-filters {
        top: 65px;
        padding: 0.8rem 0;
    }
    
    .navbar-scrolled + .category-filters {
        top: 50px;
    }
    
    .category-filters .container-fluid {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    
    .category-filters .d-flex {
        gap: 2rem;
    }
    
    .category-item {
        min-width: 60px;
        font-size: 0.7rem;
        gap: 0.5rem;
        padding: 0.3rem 0 0.6rem 0;
    }
    
    .category-item i {
        font-size: 1.4rem;
    }
    
    .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .page-header h2 {
        font-size: 1.5rem;
    }
    
    .listings-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
    }
    
    footer .row > div {
        margin-bottom: 2rem;
    }
    
    /* Form Elements Responsive */
    .category-grid {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
        padding: 10px;
    }
    
    .preview-image .remove-btn {
        width: 20px;
        height: 20px;
        font-size: 10px;
        top: 3px;
        right: 3px;
    }
    
    .current-image img {
        height: 120px;
    }
    
    /* Show page mobile styles */
    .thumbnail-item img {
        width: 60px !important;
        height: 60px !important;
    }
    
    .main-image-container img {
        max-height: 300px;
    }
    
    .card.sticky-top {
        position: relative !important;
        top: 0 !important;
        margin-top: 20px;
    }
    
    .row.g-3.mb-4.pb-3.border-bottom .col-6 {
        margin-bottom: 1rem;
    }
}

@media (max-width: 576px) {
    .category-filters .d-flex {
        gap: 1.5rem;
    }
    
    .category-item {
        min-width: 55px;
    }
    
    .category-item i {
        font-size: 1.3rem;
    }
    
    .listings-grid {
        grid-template-columns: 1fr;
        gap: 1.8rem;
    }
    
    .category-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
    
    .category-checkbox {
        padding: 4px 8px;
    }
    
    .category-item {
        font-size: 0.8rem;
    }
    
    /* Show page mobile styles */
    .d-flex.flex-wrap.gap-3.mb-3.small {
        gap: 0.5rem !important;
    }
    
    .badge.rounded-pill.bg-light {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
    }
    
    .modal-dialog.modal-xl {
        margin: 0.5rem;
    }
}