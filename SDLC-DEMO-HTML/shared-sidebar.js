/**
 * Shared Sidebar Component
 * Provides consistent expand/collapse functionality across all pages
 */

class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.toggleButton = null;
        this.isExpanded = true;
        this.isMobile = window.innerWidth < 1024;
        
        this.init();
    }
    
    init() {
        this.sidebar = document.getElementById('sidebar');
        this.toggleButton = document.getElementById('sidebar-toggle');
        
        if (!this.sidebar || !this.toggleButton) {
            console.warn('Sidebar elements not found');
            return;
        }
        
        this.setupEventListeners();
        this.setupResponsive();
        this.loadSavedState();
        this.addAnimations();
    }
    
    setupEventListeners() {
        // Toggle button click
        this.toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggle();
        });
        
        // Keyboard shortcut (Ctrl/Cmd + B)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggle();
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Click outside to close on mobile
        document.addEventListener('click', (e) => {
            if (this.isMobile && this.isExpanded && 
                !this.sidebar.contains(e.target) && 
                !this.toggleButton.contains(e.target)) {
                this.collapse();
            }
        });
    }
    
    setupResponsive() {
        this.handleResize();
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 1024;
        
        // If switching from desktop to mobile, ensure sidebar is handled correctly
        if (!wasMobile && this.isMobile) {
            this.sidebar.classList.add('fixed', 'z-40', 'h-full', '-translate-x-full');
            this.sidebar.classList.remove('translate-x-0');
            this.removeOverlay();
        } else if (wasMobile && !this.isMobile) {
            this.sidebar.classList.remove('fixed', 'z-40', 'h-full', '-translate-x-full', 'translate-x-0');
            this.removeOverlay();
        }
    }
    
    toggle() {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }
    
    expand() {
        this.isExpanded = true;
        this.sidebar.setAttribute('data-expanded', 'true');
        
        // Update toggle icon
        const icon = this.toggleButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-left');
        }
        
        // Show text elements with staggered animation
        const textElements = document.querySelectorAll('.sidebar-text');
        textElements.forEach((el, index) => {
            el.style.display = 'block';
            setTimeout(() => {
                el.classList.remove('opacity-0', 'scale-95');
                el.classList.add('opacity-100', 'scale-100');
            }, index * 20 + 50);
        });
        
        // Restore navigation items
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(link => {
            link.classList.remove('justify-center', 'px-2');
            link.classList.add('px-3');
            link.removeAttribute('title');
        });
        
        // Handle mobile state
        if (this.isMobile) {
            this.sidebar.classList.remove('-translate-x-full');
            this.sidebar.classList.add('translate-x-0');
            this.createOverlay();
        }
        
        this.saveState();
        this.triggerEvent('expanded');
    }
    
    collapse() {
        this.isExpanded = false;
        this.sidebar.setAttribute('data-expanded', 'false');
        
        // Update toggle icon
        const icon = this.toggleButton.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-chevron-left');
            icon.classList.add('fa-chevron-right');
        }
        
        // Hide text elements with animation
        const textElements = document.querySelectorAll('.sidebar-text');
        textElements.forEach((el, index) => {
            el.classList.remove('opacity-100', 'scale-100');
            el.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                el.style.display = 'none';
            }, 150);
        });
        
        // Adjust navigation items for collapsed state
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(link => {
            link.classList.add('justify-center', 'px-2');
            link.classList.remove('px-3');
            
            // Set tooltip text
            const textSpan = link.querySelector('.sidebar-text');
            if (textSpan) {
                link.setAttribute('title', textSpan.textContent.trim());
            }
        });
        
        // Handle mobile state
        if (this.isMobile) {
            this.sidebar.classList.remove('translate-x-0');
            this.sidebar.classList.add('-translate-x-full');
            this.removeOverlay();
        }
        
        this.saveState();
        this.triggerEvent('collapsed');
    }
    
    createOverlay() {
        if (document.querySelector('.sidebar-overlay')) return;
        
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay fixed inset-0 bg-black bg-opacity-50 z-40';
        overlay.addEventListener('click', () => this.collapse());
        document.body.appendChild(overlay);
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    addAnimations() {
        // Add transition classes to text elements
        document.querySelectorAll('.sidebar-text').forEach(el => {
            el.classList.add('transition-all', 'duration-200', 'ease-in-out');
        });
        
        // Add hover animations to nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    item.style.transform = 'translateX(4px)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateX(0)';
            });
        });
    }
    
    saveState() {
        localStorage.setItem('sidebarExpanded', this.isExpanded.toString());
    }
    
    loadSavedState() {
        const saved = localStorage.getItem('sidebarExpanded');
        if (saved !== null) {
            const shouldExpand = saved === 'true';
            if (shouldExpand !== this.isExpanded) {
                if (shouldExpand) {
                    this.expand();
                } else {
                    this.collapse();
                }
            }
        }
    }
    
    triggerEvent(type) {
        const event = new CustomEvent('sidebarStateChange', {
            detail: { type, isExpanded: this.isExpanded }
        });
        document.dispatchEvent(event);
    }
    
    // Public API methods
    getState() {
        return {
            isExpanded: this.isExpanded,
            isMobile: this.isMobile
        };
    }
    
    setActiveItem(selector) {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active', 'bg-brand-primary', 'text-white');
            item.classList.add('text-gray-600');
        });
        
        // Add active class to specified item
        const activeItem = document.querySelector(selector);
        if (activeItem) {
            activeItem.classList.add('active', 'bg-brand-primary', 'text-white');
            activeItem.classList.remove('text-gray-600');
        }
    }
    
    addMenuItem(config) {
        const { 
            section = 'main', 
            icon, 
            text, 
            href = '#', 
            active = false,
            position = 'bottom'
        } = config;
        
        const sectionElement = document.querySelector(`[data-section="${section}"]`);
        if (!sectionElement) return;
        
        const menuItem = document.createElement('a');
        menuItem.href = href;
        menuItem.className = `nav-item flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group ${
            active ? 'text-white bg-brand-primary' : 'text-gray-600 hover:bg-brand-secondary hover:text-brand-primary'
        }`;
        
        menuItem.innerHTML = `
            <i class="fa-solid fa-${icon} w-5 h-5 mr-3 flex-shrink-0 ${
                active ? '' : 'text-gray-400 group-hover:text-brand-primary'
            } transition-colors"></i>
            <span class="sidebar-text">${text}</span>
        `;
        
        if (position === 'top') {
            sectionElement.prepend(menuItem);
        } else {
            sectionElement.appendChild(menuItem);
        }
        
        return menuItem;
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarManager;
}