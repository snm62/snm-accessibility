class AccessibilityWidget {
    constructor() {
        this.settings = {};
        this.contentScale = 100; // Start at 100% (normal size)
        this.fontSize = 100;
        this.lineHeight = 100;
        this.letterSpacing = 100;
        console.log('Accessibility Widget: Initializing...');
        console.log('Accessibility Widget: Initial lineHeight value:', this.lineHeight);
        this.init();
    }

    init() {
        this.addFontAwesome();
        this.createWidget();
        this.loadSettings();
        
        // Delay binding events to ensure elements are created
        setTimeout(() => {
            this.bindEvents();
            this.applySettings();
            
            // Force initialize keyboard navigation
            console.log('Accessibility Widget: Force initializing keyboard navigation...');
            this.initKeyboardShortcuts();
            
            // Add text alignment controls
            this.addTextAlignmentToPanel();
            
            console.log('Accessibility Widget: Initialized successfully');
        }, 100);
    }

    bindEvents() {
        console.log('Accessibility Widget: Starting to bind events...');
        
        // Panel toggle functionality
        const icon = document.getElementById('accessibility-icon');
        const panel = document.getElementById('accessibility-panel');
        const closeBtn = document.getElementById('close-panel');
        
        console.log('Accessibility Widget: Found icon:', !!icon);
        console.log('Accessibility Widget: Found panel:', !!panel);
        console.log('Accessibility Widget: Found close button:', !!closeBtn);
        
        if (icon) {
            icon.addEventListener('click', () => {
                console.log('Accessibility Widget: Icon clicked, toggling panel');
                this.togglePanel();
                
                // Debug: Check panel state
                const panel = document.getElementById('accessibility-panel');
                if (panel) {
                    console.log('Accessibility Widget: Panel found, current classes:', panel.className);
                    console.log('Accessibility Widget: Panel has active class:', panel.classList.contains('active'));
                    console.log('Accessibility Widget: Panel computed right position:', window.getComputedStyle(panel).right);
                } else {
                    console.error('Accessibility Widget: Panel not found after click!');
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('Accessibility Widget: Close button clicked');
                this.togglePanel();
            });
        }
        
        // Toggle switches
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const feature = e.target.id;
                const enabled = e.target.checked;
                console.log(`Accessibility Widget: Toggle ${feature} changed to ${enabled}`);
                this.handleToggle(feature, enabled);
            });
        });
        
        // Action buttons
        const resetBtn = document.getElementById('reset-settings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('Accessibility Widget: Reset settings clicked');
                this.resetSettings();
            });
        }
        
        const statementBtn = document.getElementById('statement');
        if (statementBtn) {
            statementBtn.addEventListener('click', () => {
                console.log('Accessibility Widget: Statement button clicked');
                this.showStatement();
            });
        }
        
        const hideBtn = document.getElementById('hide-interface');
        if (hideBtn) {
            hideBtn.addEventListener('click', () => {
                console.log('Accessibility Widget: Hide interface clicked');
                this.hideInterface();
            });
        }
        
        console.log('Accessibility Widget: Events bound successfully');
    }

    initTextMagnifier() {
        // Initialize text magnifier functionality
        console.log('Accessibility Widget: Text magnifier initialized');
    }

    initKeyboardShortcuts() {
        console.log('Accessibility Widget: Initializing keyboard shortcuts...');
        
        // Remove existing shortcuts if any
        this.removeKeyboardShortcuts();
        
        // Initialize element tracking for cycling
        this.currentElementIndex = {};
        this.highlightedElements = [];
        
        // Add keyboard shortcuts for navigation
        this.keyboardShortcutHandler = (e) => {
            console.log('Accessibility Widget: Key pressed:', e.key, 'Keyboard nav enabled:', this.settings['keyboard-nav']);
            
            // Only activate if keyboard navigation is enabled
            if (!this.settings['keyboard-nav']) {
                console.log('Accessibility Widget: Keyboard navigation not enabled');
                return;
            }
            
            // Check if user is typing in an input field
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
                console.log('Accessibility Widget: Ignoring key press in input field');
                return; // Don't interfere with typing
            }
            
            // Single key navigation (no Alt/Ctrl needed)
            switch(e.key.toLowerCase()) {
                case 'm': // Menus
                    e.preventDefault();
                    console.log('Accessibility Widget: M key pressed - cycling through menus');
                    this.cycleThroughElements('nav, [role="navigation"], .menu, .navbar', 'menu');
                    break;
                case 'h': // Headings
                    e.preventDefault();
                    console.log('Accessibility Widget: H key pressed - cycling through headings');
                    this.cycleThroughElements('h1, h2, h3, h4, h5, h6', 'heading');
                    break;
                case 'f': // Forms
                    e.preventDefault();
                    console.log('Accessibility Widget: F key pressed - cycling through forms');
                    this.cycleThroughElements('form, input, textarea, select, button[type="submit"]', 'form');
                    break;
                case 'b': // Buttons
                    e.preventDefault();
                    console.log('Accessibility Widget: B key pressed - cycling through buttons');
                    this.cycleThroughElements('button, .btn, input[type="button"], input[type="submit"]', 'button');
                    break;
                case 'g': // Graphics
                    e.preventDefault();
                    console.log('Accessibility Widget: G key pressed - cycling through graphics');
                    this.cycleThroughElements('img, svg, canvas, .image, .graphic', 'graphic');
                    break;
                case 'l': // Links
                    e.preventDefault();
                    console.log('Accessibility Widget: L key pressed - cycling through links');
                    this.cycleThroughElements('a[href], .link', 'link');
                    break;
                case 's': // Skip to main content
                    e.preventDefault();
                    console.log('Accessibility Widget: S key pressed - skipping to main content');
                    this.focusElement('main, [role="main"], .main-content, #main');
                    break;
                default:
                    // For any other key, just log it to see if the event listener is working
                    console.log('Accessibility Widget: Other key pressed:', e.key);
                    break;
            }
        };
        
        // Add event listener
        document.addEventListener('keydown', this.keyboardShortcutHandler);
        console.log('Accessibility Widget: Keyboard shortcuts initialized successfully');
        
        // Test if event listener is working
        setTimeout(() => {
            console.log('Accessibility Widget: Testing keyboard event listener...');
            // Simulate a key press to test
            const testEvent = new KeyboardEvent('keydown', { key: 'h' });
            document.dispatchEvent(testEvent);
        }, 1000);
    }

    removeKeyboardShortcuts() {
        if (this.keyboardShortcutHandler) {
            document.removeEventListener('keydown', this.keyboardShortcutHandler);
            this.keyboardShortcutHandler = null;
            console.log('Accessibility Widget: Keyboard shortcuts removed');
        }
        
        // Remove all highlighted elements
        this.removeAllHighlights();
        
        // Reset element tracking
        this.currentElementIndex = {};
    }

    cycleThroughElements(selector, type) {
        console.log(`Accessibility Widget: Cycling through ${type} elements with selector: ${selector}`);
        
        // Remove previous highlights
        this.removeAllHighlights();
        
        // Get all matching elements
        const elements = Array.from(document.querySelectorAll(selector));
        console.log(`Accessibility Widget: Found ${elements.length} ${type} elements`);
        
        if (elements.length === 0) {
            console.log(`Accessibility Widget: No ${type} elements found`);
            return;
        }
        
        // Get current index for this type
        const currentIndex = this.currentElementIndex[type] || 0;
        const element = elements[currentIndex];
        
        console.log(`Accessibility Widget: Highlighting ${type} element ${currentIndex + 1} of ${elements.length}:`, element);
        
        // Create highlight
        this.createHighlight(element, type, currentIndex + 1, elements.length);
        
        // Update index for next cycle
        this.currentElementIndex[type] = (currentIndex + 1) % elements.length;
        
        console.log(`Accessibility Widget: Highlighted ${type} ${currentIndex + 1} of ${elements.length}`);
    }

    createHighlight(element, type, current, total) {
        console.log(`Accessibility Widget: Creating highlight for ${type} element:`, element);
        
        const rect = element.getBoundingClientRect();
        console.log(`Accessibility Widget: Element rect:`, rect);
        
        // Create highlight box
        const highlight = document.createElement('div');
        highlight.className = 'keyboard-highlight';
        highlight.style.cssText = `
            position: fixed;
            top: ${rect.top - 3}px;
            left: ${rect.left - 3}px;
            width: ${rect.width + 6}px;
            height: ${rect.height + 6}px;
            border: 3px solid #6366f1;
            border-radius: 6px;
            background: transparent;
            pointer-events: none;
            z-index: 1000000;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
        `;
        
        // Create label
        const label = document.createElement('div');
        label.className = 'keyboard-highlight-label';
        label.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${current} of ${total}`;
        label.style.cssText = `
            position: fixed;
            top: ${rect.top - 35}px;
            left: ${rect.left}px;
            background: #6366f1;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            z-index: 1000001;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        // Add to page
        document.body.appendChild(highlight);
        document.body.appendChild(label);
        
        console.log(`Accessibility Widget: Added highlight and label to page`);
        
        // Store references for removal
        this.highlightedElements.push(highlight, label);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            this.removeAllHighlights();
        }, 3000);
    }

    removeAllHighlights() {
        this.highlightedElements.forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.highlightedElements = [];
    }

    focusElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
            console.log(`Accessibility Widget: Focused on ${selector}`);
        } else {
            console.log(`Accessibility Widget: Element not found: ${selector}`);
        }
    }

    addFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(fontAwesome);
            console.log('Accessibility Widget: Font Awesome added');
        }
    }

    createWidget() {
        // Create accessibility icon
        const icon = document.createElement('div');
        icon.id = 'accessibility-icon';
        icon.className = 'accessibility-icon';
        icon.innerHTML = '<i class="fas fa-universal-access"></i>';
        document.body.appendChild(icon);
        console.log('Accessibility Widget: Icon created with ID:', icon.id);

        // Create panel
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = this.getPanelHTML();
        document.body.appendChild(panel);
        console.log('Accessibility Widget: Panel created with ID:', panel.id);
        
        // Verify elements are in DOM
        setTimeout(() => {
            const iconCheck = document.getElementById('accessibility-icon');
            const panelCheck = document.getElementById('accessibility-panel');
            console.log('Accessibility Widget: Icon in DOM:', !!iconCheck);
            console.log('Accessibility Widget: Panel in DOM:', !!panelCheck);
            
            // Debug: Check panel visibility
            if (panelCheck) {
                const computedStyle = window.getComputedStyle(panelCheck);
                console.log('Accessibility Widget: Panel computed styles:');
                console.log('- display:', computedStyle.display);
                console.log('- visibility:', computedStyle.visibility);
                console.log('- opacity:', computedStyle.opacity);
                console.log('- right:', computedStyle.right);
                console.log('- z-index:', computedStyle.zIndex);
            }
            

        }, 100);
    }

    getPanelHTML() {
        return `
            <div class="panel-header">
                <div class="close-btn" id="close-panel">
                    <i class="fas fa-times"></i>
                </div>
                <div class="language-selector">
                    <span>ENGLISH</span>
                    <i class="fas fa-flag"></i>
                </div>
            </div>
            
            <h2>Accessibility Adjustments</h2>
            
            <div class="action-buttons">
                <button id="reset-settings" class="action-btn">
                    <i class="fas fa-redo"></i>
                    Reset Settings
                </button>
                <button id="statement" class="action-btn">
                    <i class="fas fa-file-alt"></i>
                    Statement
                </button>
                <button id="hide-interface" class="action-btn">
                    <i class="fas fa-eye-slash"></i>
                    Hide Interface
                </button>
            </div>

            <div class="profiles-section">
                <h3>Choose the right accessibility profile for you</h3>
                
                <!-- Module 1: Seizure Safe Profile -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-bolt"></i>
                        <div>
                            <h4>Seizure Safe Profile</h4>
                            <p>Clear flashes & reduces color</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="seizure-safe">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 2: Vision Impaired Profile -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-eye"></i>
                        <div>
                            <h4>Vision Impaired Profile</h4>
                            <p>Enhances website's visuals</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="vision-impaired">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 3: ADHD Friendly Profile -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-layer-group"></i>
                        <div>
                            <h4>ADHD Friendly Profile</h4>
                            <p>More focus & fewer distractions</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="adhd-friendly">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 4: Cognitive Disability Profile -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-bullseye"></i>
                        <div>
                            <h4>Cognitive Disability Profile</h4>
                            <p>Assists with reading & focusing</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="cognitive-disability">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 5: Keyboard Navigation -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-arrow-right"></i>
                        <div>
                            <h4>Keyboard Navigation (Motor)</h4>
                            <p>Use website with the keyboard</p>
                            <div class="profile-description">
                                <p>This profile enables motor-impaired persons to operate the website using keyboard keys (Tab, Shift+Tab, Enter) and shortcuts (e.g., "M" for menus, "H" for headings, "F" for forms, "B" for buttons, "G" for graphics).</p>
                                <p><strong>Note:</strong> This profile prompts automatically for keyboard users.</p>
                            </div>
                            <small style="color: #6366f1; font-style: italic;">Activates with Screen Reader</small>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="keyboard-nav" checked>
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 6: Blind Users Screen Reader -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-headphones"></i>
                        <div>
                            <h4>Blind Users (Screen Reader)</h4>
                            <p>Optimize website for screen-readers</p>
                            <div class="profile-description">
                                <p>This profile adjusts the website to be compatible with screen-readers such as JAWS, NVDA, VoiceOver, and TalkBack. Screen-reader software is installed on the blind user's computer and smartphone, and websites should ensure compatibility.</p>
                                <p><strong>Note:</strong> This profile prompts automatically to screen-readers.</p>
                            </div>
                            <small style="color: #6366f1; font-style: italic;">Activates with Keyboard Navigation</small>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="screen-reader">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 7: Content Scaling -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-expand-arrows-alt"></i>
                        <div>
                            <h4>Content Scaling</h4>
                            <p>Scale content with arrow controls</p>
                            <div class="scaling-controls" id="content-scaling-controls" style="display: none; margin-top: 10px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <button class="scaling-btn" onclick="accessibilityWidget.decreaseContentScale()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-down"></i> -5%
                                    </button>
                                    <span id="content-scale-value" style="font-weight: bold; min-width: 60px; text-align: center;">100%</span>
                                    <button class="scaling-btn" onclick="accessibilityWidget.increaseContentScale()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-up"></i> +5%
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="content-scaling">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 8: Readable Font -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-font"></i>
                        <div>
                            <h4>Readable Font</h4>
                            <p>High-legibility fonts</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="readable-font">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 9: Highlight Titles -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-heading"></i>
                        <div>
                            <h4>Highlight Titles</h4>
                            <p>Add boxes around headings</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="highlight-titles">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 10: Highlight Links -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-link"></i>
                        <div>
                            <h4>Highlight Links</h4>
                            <p>Add boxes around links</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="highlight-links">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 11: Text Magnifier -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-search-plus"></i>
                        <div>
                            <h4>Text Magnifier</h4>
                            <p>Floating magnifying glass tool</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="text-magnifier">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 12: Adjust Font Sizing -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-text-height"></i>
                        <div>
                            <h4>Adjust Font Sizing</h4>
                            <p>Font size with arrow controls</p>
                            <div class="scaling-controls" id="font-sizing-controls" style="display: none; margin-top: 10px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <button class="scaling-btn" onclick="accessibilityWidget.decreaseFontSize()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-down"></i> -10%
                                    </button>
                                    <span id="font-size-value" style="font-weight: bold; min-width: 60px; text-align: center;">100%</span>
                                    <button class="scaling-btn" onclick="accessibilityWidget.increaseFontSize()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-up"></i> +10%
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="font-sizing">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 13: Align Center -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-align-center"></i>
                        <div>
                            <h4>Align Center</h4>
                            <p>Center-aligns all text content</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="align-center">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 14: Adjust Line Height -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-arrows-alt-v"></i>
                        <div>
                            <h4>Adjust Line Height</h4>
                            <p>Line height with arrow controls</p>
                            <div class="scaling-controls" id="line-height-controls" style="display: none; margin-top: 10px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <button class="scaling-btn" onclick="accessibilityWidget.decreaseLineHeight()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-down"></i> -10%
                                    </button>
                                    <span id="line-height-value" style="font-weight: bold; min-width: 60px; text-align: center;">100%</span>
                                    <button class="scaling-btn" onclick="accessibilityWidget.increaseLineHeight()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-up"></i> +10%
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="adjust-line-height">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 15: Adjust Letter Spacing -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-text-width"></i>
                        <div>
                            <h4>Adjust Letter Spacing</h4>
                            <p>Letter spacing with arrow controls</p>
                            <div class="scaling-controls" id="letter-spacing-controls" style="display: none; margin-top: 10px;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <button class="scaling-btn" onclick="accessibilityWidget.decreaseLetterSpacing()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-down"></i> -10%
                                    </button>
                                    <span id="letter-spacing-value" style="font-weight: bold; min-width: 60px; text-align: center;">100%</span>
                                    <button class="scaling-btn" onclick="accessibilityWidget.increaseLetterSpacing()" style="background: #6366f1; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                                        <i class="fas fa-chevron-up"></i> +10%
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="adjust-letter-spacing">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 16: Align Left -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-align-left"></i>
                        <div>
                            <h4>Align Left</h4>
                            <p>Left-aligns text content</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="align-left">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 17: Align Right -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-align-right"></i>
                        <div>
                            <h4>Align Right</h4>
                            <p>Right-aligns text content</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="align-right">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 18: Dark Contrast -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-moon"></i>
                        <div>
                            <h4>Dark Contrast</h4>
                            <p>Dark background with light text</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dark-contrast">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 19: Light Contrast -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-sun"></i>
                        <div>
                            <h4>Light Contrast</h4>
                            <p>Light background with dark text</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="light-contrast">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 20: High Contrast -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-adjust"></i>
                        <div>
                            <h4>High Contrast</h4>
                            <p>Maximum contrast implementation</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="high-contrast">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 21: High Saturation -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-palette"></i>
                        <div>
                            <h4>High Saturation</h4>
                            <p>Increases color intensity</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="high-saturation">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 22: Adjust Text Colors -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-paint-brush"></i>
                        <div>
                            <h4>Adjust Text Colors</h4>
                            <p>Color picker functionality</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="adjust-text-colors">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 23: Monochrome -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-circle"></i>
                        <div>
                            <h4>Monochrome</h4>
                            <p>Removes all colors except black, white, grays</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="monochrome">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 24: Adjust Title Colors -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-heading"></i>
                        <div>
                            <h4>Adjust Title Colors</h4>
                            <p>Color customization for headings</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="adjust-title-colors">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 25: Low Saturation -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-tint"></i>
                        <div>
                            <h4>Low Saturation</h4>
                            <p>Reduces color intensity</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="low-saturation">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 26: Adjust Background Colors -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-fill-drip"></i>
                        <div>
                            <h4>Adjust Background Colors</h4>
                            <p>Background color customization</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="adjust-bg-colors">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 27: Mute Sound -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-volume-mute"></i>
                        <div>
                            <h4>Mute Sound</h4>
                            <p>Disables all audio content</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="mute-sound">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 28: Hide Images -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-image"></i>
                        <div>
                            <h4>Hide Images</h4>
                            <p>Toggle to hide all images</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="hide-images">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 29: Read Mode -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-book-open"></i>
                        <div>
                            <h4>Read Mode</h4>
                            <p>Removes navigation elements</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="read-mode">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 30: Reading Guide -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-highlighter"></i>
                        <div>
                            <h4>Reading Guide</h4>
                            <p>Movable highlight bar</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="reading-guide">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 31: Useful Links -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-external-link-alt"></i>
                        <div>
                            <h4>Useful Links</h4>
                            <p>Accessibility resources compilation</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="useful-links">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 32: Stop Animation -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-pause"></i>
                        <div>
                            <h4>Stop Animation</h4>
                            <p>Pauses all CSS animations</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="stop-animation">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 33: Reading Mask -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-mask"></i>
                        <div>
                            <h4>Reading Mask</h4>
                            <p>Semi-transparent overlay</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="reading-mask">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 34: Highlight Hover -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-mouse-pointer"></i>
                        <div>
                            <h4>Highlight Hover</h4>
                            <p>Visual feedback on hover</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="highlight-hover">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 35: Highlight Focus -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-crosshairs"></i>
                        <div>
                            <h4>Highlight Focus</h4>
                            <p>Prominent focus indicators</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="highlight-focus">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 36: Big Black Cursor -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-mouse"></i>
                        <div>
                            <h4>Big Black Cursor</h4>
                            <p>Increases cursor size</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="big-black-cursor">
                        <span class="slider"></span>
                    </label>
                </div>

                <!-- Module 37: Big White Cursor -->
                <div class="profile-item">
                    <div class="profile-info">
                        <i class="fas fa-mouse"></i>
                        <div>
                            <h4>Big White Cursor</h4>
                            <p>Increases cursor size</p>
                        </div>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" id="big-white-cursor">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="panel-footer">
                <div>
                    <i class="fas fa-check"></i>
                    Accessibility Features
                </div>
            </div>
        `;
    }



    togglePanel() {
        console.log('Accessibility Widget: Toggling panel...');
        const panel = document.getElementById('accessibility-panel');
        
        if (panel) {
            console.log('Accessibility Widget: Panel found, current classes:', panel.className);
            console.log('Accessibility Widget: Panel has active class before toggle:', panel.classList.contains('active'));
            console.log('Accessibility Widget: Panel computed right position before toggle:', window.getComputedStyle(panel).right);
            
            if (panel.classList.contains('active')) {
                panel.classList.remove('active');
                console.log('Accessibility Widget: Panel closed');
            } else {
                panel.classList.add('active');
                console.log('Accessibility Widget: Panel opened');
            }
            
            console.log('Accessibility Widget: Panel has active class after toggle:', panel.classList.contains('active'));
            console.log('Accessibility Widget: Panel computed right position after toggle:', window.getComputedStyle(panel).right);
            
            // Force a repaint
            panel.offsetHeight;
        } else {
            console.error('Accessibility Widget: Panel not found!');
        }
    }

    showStatement() {
        alert('Accessibility Statement: This website is committed to providing an accessible experience for all users. We follow WCAG 2.1 guidelines and continuously work to improve accessibility.');
    }

    hideInterface() {
        const icon = document.getElementById('accessibility-icon');
        const panel = document.getElementById('accessibility-panel');
        
        if (icon) icon.style.display = 'none';
        if (panel) panel.style.display = 'none';
        
        // Show a small "Show Accessibility" button
        const showBtn = document.createElement('button');
        showBtn.id = 'show-accessibility';
        showBtn.innerHTML = 'Show Accessibility';
        showBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 99999;
            font-size: 12px;
        `;
        
        showBtn.addEventListener('click', () => {
            if (icon) icon.style.display = 'flex';
            if (panel) panel.style.display = 'block';
            showBtn.remove();
        });
        
        document.body.appendChild(showBtn);
    }

    handleToggle(feature, enabled) {
        this.settings[feature] = enabled;
        this.saveSettings();
        
        // Special handling for keyboard navigation and screen reader
        if (feature === 'keyboard-nav' || feature === 'screen-reader') {
            this.handleAccessibilityProfiles(feature, enabled);
        } else {
            this.applyFeature(feature, enabled);
        }
    }

    handleAccessibilityProfiles(feature, enabled) {
        // Get the toggle elements
        const keyboardToggle = document.getElementById('keyboard-nav');
        const screenReaderToggle = document.getElementById('screen-reader');
        
        if (enabled) {
            // When either profile is enabled, enable both
            this.settings['keyboard-nav'] = true;
            this.settings['screen-reader'] = true;
            
            // Update both toggles to checked state
            if (keyboardToggle) keyboardToggle.checked = true;
            if (screenReaderToggle) screenReaderToggle.checked = true;
            
            // Apply both features
            this.applyFeature('keyboard-nav', true);
            this.applyFeature('screen-reader', true);
            
            // Initialize keyboard navigation shortcuts
            this.initKeyboardShortcuts();
            
            // Play sound effect
            this.playAccessibilitySound();
            
            // Save updated settings
            this.saveSettings();
            
            console.log('Accessibility Widget: Both keyboard navigation and screen reader profiles activated');
        } else {
            // When either profile is disabled, disable both
            this.settings['keyboard-nav'] = false;
            this.settings['screen-reader'] = false;
            
            // Update both toggles to unchecked state
            if (keyboardToggle) keyboardToggle.checked = false;
            if (screenReaderToggle) screenReaderToggle.checked = false;
            
            // Remove both features
            this.applyFeature('keyboard-nav', false);
            this.applyFeature('screen-reader', false);
            
            // Remove keyboard shortcuts
            this.removeKeyboardShortcuts();
            
            // Save updated settings
            this.saveSettings();
            
            console.log('Accessibility Widget: Both keyboard navigation and screen reader profiles deactivated');
        }
    }

    initKeyboardShortcuts() {
        // Remove existing shortcuts if any
        this.removeKeyboardShortcuts();
        
        // Initialize element tracking for cycling
        this.currentElementIndex = {};
        this.highlightedElements = [];
        
        // Add keyboard shortcuts for navigation
        this.keyboardShortcutHandler = (e) => {
            // Only activate if keyboard navigation is enabled
            if (!this.settings['keyboard-nav']) {
                console.log('Accessibility Widget: Keyboard navigation not enabled');
                return;
            }
            
            console.log('Accessibility Widget: Key pressed:', e.key, 'Keyboard nav enabled:', this.settings['keyboard-nav']);
            
            // Check if user is typing in an input field
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
                console.log('Accessibility Widget: Ignoring key press in input field');
                return; // Don't interfere with typing
            }
            
            // Single key navigation (no Alt/Ctrl needed)
            switch(e.key.toLowerCase()) {
                case 'm': // Menus
                    e.preventDefault();
                    console.log('Accessibility Widget: M key pressed - cycling through menus');
                    this.cycleThroughElements('nav, [role="navigation"], .menu, .navbar', 'menu');
                    break;
                case 'h': // Headings
                    e.preventDefault();
                    console.log('Accessibility Widget: H key pressed - cycling through headings');
                    this.cycleThroughElements('h1, h2, h3, h4, h5, h6', 'heading');
                    break;
                case 'f': // Forms
                    e.preventDefault();
                    console.log('Accessibility Widget: F key pressed - cycling through forms');
                    this.cycleThroughElements('form, input, textarea, select, button[type="submit"]', 'form');
                    break;
                case 'b': // Buttons
                    e.preventDefault();
                    console.log('Accessibility Widget: B key pressed - cycling through buttons');
                    this.cycleThroughElements('button, .btn, [role="button"]', 'button');
                    break;
                case 'g': // Graphics/Images
                    e.preventDefault();
                    console.log('Accessibility Widget: G key pressed - cycling through graphics');
                    this.cycleThroughElements('img, svg, canvas, [role="img"]', 'graphic');
                    break;
                case 'l': // Links
                    e.preventDefault();
                    console.log('Accessibility Widget: L key pressed - cycling through links');
                    this.cycleThroughElements('a[href]', 'link');
                    break;
                case 's': // Skip to main content
                    e.preventDefault();
                    console.log('Accessibility Widget: S key pressed - skipping to main content');
                    this.focusElement('main, [role="main"], #main, .main');
                    break;
            }
        };
        
        document.addEventListener('keydown', this.keyboardShortcutHandler);
        console.log('Accessibility Widget: Keyboard shortcuts initialized successfully');
    }

    removeKeyboardShortcuts() {
        if (this.keyboardShortcutHandler) {
            document.removeEventListener('keydown', this.keyboardShortcutHandler);
            this.keyboardShortcutHandler = null;
            console.log('Accessibility Widget: Keyboard shortcuts removed');
        }
        
        // Remove all highlighted elements
        this.removeAllHighlights();
        
        // Reset element tracking
        this.currentElementIndex = {};
    }

    cycleThroughElements(selector, type) {
        // Remove previous highlights
        this.removeAllHighlights();
        
        // Get all matching elements
        const elements = Array.from(document.querySelectorAll(selector)).filter(element => 
            this.isElementVisible(element) && this.isElementFocusable(element)
        );
        
        if (elements.length === 0) {
            console.log(`Accessibility Widget: No ${type} elements found`);
            return;
        }
        
        // Initialize or increment index for this type
        if (!this.currentElementIndex[type]) {
            this.currentElementIndex[type] = 0;
        } else {
            this.currentElementIndex[type] = (this.currentElementIndex[type] + 1) % elements.length;
        }
        
        // Get current element
        const currentElement = elements[this.currentElementIndex[type]];
        
        // Highlight the current element
        this.highlightElement(currentElement, type);
        
        // Focus and scroll to element
        currentElement.focus();
        currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        console.log(`Accessibility Widget: Highlighted ${type} ${this.currentElementIndex[type] + 1} of ${elements.length}`);
    }

    highlightElement(element, type) {
        // Create highlight box
        const highlight = document.createElement('div');
        highlight.className = 'keyboard-highlight';
        highlight.setAttribute('data-type', type);
        highlight.style.cssText = `
            position: absolute;
            border: 3px solid #6366f1;
            border-radius: 6px;
            background: transparent;
            pointer-events: none;
            z-index: 1000000;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
        `;
        
        // Position the highlight
        const rect = element.getBoundingClientRect();
        highlight.style.top = (rect.top + window.scrollY - 3) + 'px';
        highlight.style.left = (rect.left + window.scrollX - 3) + 'px';
        highlight.style.width = (rect.width + 6) + 'px';
        highlight.style.height = (rect.height + 6) + 'px';
        
        // Add to document
        document.body.appendChild(highlight);
        this.highlightedElements.push(highlight);
        
        // Add label
        const label = document.createElement('div');
        label.className = 'keyboard-highlight-label';
        label.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${this.currentElementIndex[type] + 1}`;
        label.style.cssText = `
            position: absolute;
            top: -30px;
            left: 0;
            background: #6366f1;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            z-index: 1000001;
        `;
        
        highlight.appendChild(label);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (highlight.parentNode) {
                highlight.remove();
                this.highlightedElements = this.highlightedElements.filter(h => h !== highlight);
            }
        }, 3000);
    }

    removeAllHighlights() {
        this.highlightedElements.forEach(highlight => {
            if (highlight.parentNode) {
                highlight.remove();
            }
        });
        this.highlightedElements = [];
    }

    focusElement(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            // Find the first visible and focusable element
            for (let element of elements) {
                if (this.isElementVisible(element) && this.isElementFocusable(element)) {
                    element.focus();
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add temporary highlight
                    element.style.outline = '3px solid var(--primary-color)';
                    element.style.outlineOffset = '2px';
                    
                    setTimeout(() => {
                        element.style.outline = '';
                        element.style.outlineOffset = '';
                    }, 2000);
                    
                    console.log(`Accessibility Widget: Focused on ${selector}`);
                    return;
                }
            }
        }
        console.log(`Accessibility Widget: No focusable elements found for ${selector}`);
    }

    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' && 
               element.offsetWidth > 0 && 
               element.offsetHeight > 0;
    }

    isElementFocusable(element) {
        const tag = element.tagName.toLowerCase();
        const type = element.type;
        
        // Check if element is naturally focusable
        if (tag === 'a' || tag === 'button' || tag === 'input' || tag === 'textarea' || tag === 'select') {
            return true;
        }
        
        // Check if element has tabindex
        if (element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1') {
            return true;
        }
        
        // Check if element has role that makes it focusable
        const role = element.getAttribute('role');
        if (role === 'button' || role === 'link' || role === 'menuitem' || role === 'tab') {
            return true;
        }
        
        return false;
    }

    playAccessibilitySound() {
        try {
            // Create audio context for sound generation
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configure sound (pleasant notification sound)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800Hz
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1); // Rise to 1000Hz
            
            // Configure volume envelope
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            // Play the sound
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            
            console.log('Accessibility Widget: Sound effect played');
        } catch (error) {
            console.log('Accessibility Widget: Could not play sound effect', error);
        }
    }

    applyFeature(feature, enabled) {
        const body = document.body;
        
        if (enabled) {
            body.classList.add(feature);
            
            // Special handling for specific features
            switch(feature) {
                case 'keyboard-nav':
                    this.initKeyboardShortcuts();
                    console.log('Accessibility Widget: Keyboard navigation enabled');
                    break;
                case 'text-magnifier':
                    this.initTextMagnifier(); // Initialize first
                    this.enableTextMagnifier();
                    break;
                case 'font-sizing':
                    this.enableFontSizing();
                    this.showFontSizingControls();
                    break;
                case 'content-scaling':
                    this.showContentScalingControls();
                    break;
                case 'adjust-line-height':
                    this.showLineHeightControls();
                    break;
                case 'adjust-letter-spacing':
                    this.showLetterSpacingControls();
                    break;
                case 'highlight-titles':
                    this.highlightTitles();
                    break;
                case 'highlight-links':
                    this.highlightLinks();
                    break;
                case 'adjust-text-colors':
                    this.showColorPicker('text');
                    break;
                case 'adjust-title-colors':
                    this.showColorPicker('title');
                    break;
                case 'adjust-bg-colors':
                    this.showColorPicker('background');
                    break;
                case 'useful-links':
                    this.showUsefulLinks();
                    break;
                case 'adhd-friendly':
                    this.createADHDSpotlight();
                    break;
                case 'screen-reader':
                    this.enhanceScreenReaderSupport();
                    break;
            }
        } else {
            body.classList.remove(feature);
            
            // Special handling for specific features
            switch(feature) {
                case 'keyboard-nav':
                    this.removeKeyboardShortcuts();
                    console.log('Accessibility Widget: Keyboard navigation disabled');
                    break;
                case 'text-magnifier':
                    this.disableTextMagnifier();
                    break;
                case 'font-sizing':
                    this.disableFontSizing();
                    this.hideFontSizingControls();
                    break;
                case 'content-scaling':
                    this.hideContentScalingControls();
                    this.resetContentScale();
                    break;
                case 'adjust-line-height':
                    this.hideLineHeightControls();
                    this.resetLineHeight();
                    break;
                case 'adjust-letter-spacing':
                    this.hideLetterSpacingControls();
                    this.resetLetterSpacing();
                    break;
                case 'highlight-titles':
                    this.removeTitleHighlights();
                    break;
                case 'highlight-links':
                    this.removeLinkHighlights();
                    break;
                case 'adhd-friendly':
                    this.removeADHDSpotlight();
                    break;
                case 'screen-reader':
                    this.removeScreenReaderEnhancements();
                    break;
            }
        }
    }

    enhanceScreenReaderSupport() {
        // Add skip link if it doesn't exist
        if (!document.getElementById('skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.id = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-color);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000000;
                transition: top 0.3s;
            `;
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
            });
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Add ARIA landmarks if they don't exist
        this.addAriaLandmarks();
        
        // Enhance form labels and inputs
        this.enhanceFormAccessibility();
        
        // Add alt text to images without alt
        this.addAltTextToImages();
        
        console.log('Accessibility Widget: Screen reader support enhanced');
    }

    removeScreenReaderEnhancements() {
        // Remove skip link
        const skipLink = document.getElementById('skip-link');
        if (skipLink) {
            skipLink.remove();
        }
        
        // Remove added ARIA attributes
        this.removeAriaEnhancements();
        
        console.log('Accessibility Widget: Screen reader enhancements removed');
    }

    addAriaLandmarks() {
        // Add main landmark if it doesn't exist
        const mainContent = document.querySelector('main, [role="main"], #main, .main');
        if (mainContent && !mainContent.id) {
            mainContent.id = 'main-content';
        }
        
        // Add navigation landmarks
        const navs = document.querySelectorAll('nav');
        navs.forEach((nav, index) => {
            if (!nav.getAttribute('aria-label')) {
                nav.setAttribute('aria-label', `Navigation ${index + 1}`);
            }
        });
        
        // Add banner landmark
        const header = document.querySelector('header');
        if (header && !header.getAttribute('role')) {
            header.setAttribute('role', 'banner');
        }
        
        // Add contentinfo landmark
        const footer = document.querySelector('footer');
        if (footer && !footer.getAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    removeAriaEnhancements() {
        // Remove added ARIA attributes (be careful not to remove existing ones)
        const skipLink = document.getElementById('skip-link');
        if (skipLink) {
            skipLink.remove();
        }
    }

    enhanceFormAccessibility() {
        // Add labels to inputs without labels
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach((input, index) => {
            if (!input.id && !input.getAttribute('aria-label')) {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    input.id = `input-${index}`;
                    label.setAttribute('for', input.id);
                } else {
                    input.setAttribute('aria-label', `Input field ${index + 1}`);
                }
            }
        });
    }

    addAltTextToImages() {
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.alt && !img.getAttribute('aria-label')) {
                img.setAttribute('alt', `Image ${index + 1}`);
            }
        });
    }

    createADHDSpotlight() {
        // Remove existing spotlight if any
        this.removeADHDSpotlight();
        
        // Create spotlight container
        const spotlightContainer = document.createElement('div');
        spotlightContainer.id = 'adhd-spotlight-container';
        spotlightContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 100001;
            overflow: hidden;
        `;
        document.body.appendChild(spotlightContainer);
        
        // Create spotlight overlay with brightness effect
        const spotlight = document.createElement('div');
        spotlight.id = 'adhd-spotlight';
        spotlight.style.cssText = `
            position: absolute;
            width: 100%;
            height: 200px;
            background: linear-gradient(to bottom, 
                transparent 0%, 
                rgba(255, 255, 255, 0.1) 20%, 
                rgba(255, 255, 255, 0.15) 50%, 
                rgba(255, 255, 255, 0.1) 80%, 
                transparent 100%);
            border-top: 1px solid rgba(255, 255, 255, 0.6);
            border-bottom: 1px solid rgba(255, 255, 255, 0.6);
            transform: translateY(-50%);
            transition: none;
            backdrop-filter: brightness(1.3);
        `;
        spotlightContainer.appendChild(spotlight);
        
        // Add mouse move event listener
        this.adhdMouseMoveHandler = (e) => {
            spotlight.style.top = e.clientY + 'px';
        };
        
        document.addEventListener('mousemove', this.adhdMouseMoveHandler);
        console.log('Accessibility Widget: ADHD spotlight created with overlay brightness effect');
    }

    removeADHDSpotlight() {
        const spotlightContainer = document.getElementById('adhd-spotlight-container');
        if (spotlightContainer) {
            spotlightContainer.remove();
        }
        
        // Remove mouse move event listener
        if (this.adhdMouseMoveHandler) {
            document.removeEventListener('mousemove', this.adhdMouseMoveHandler);
            this.adhdMouseMoveHandler = null;
        }
        
        console.log('Accessibility Widget: ADHD spotlight removed');
    }

    initTextMagnifier() {
        // Remove existing magnifier if any
        const existingMagnifier = document.getElementById('text-magnifier');
        if (existingMagnifier) {
            existingMagnifier.remove();
        }
        
        const magnifier = document.createElement('div');
        magnifier.className = 'magnifier';
        magnifier.id = 'text-magnifier';
        magnifier.style.cssText = `
            position: fixed;
            display: none;
            z-index: 1000000;
            pointer-events: none;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(magnifier);
        console.log('Accessibility Widget: Text magnifier initialized');
    }

    enableTextMagnifier() {
        // Initialize magnifier if not exists
        this.initTextMagnifier();
        
        const magnifier = document.getElementById('text-magnifier');
        if (!magnifier) {
            console.error('Accessibility Widget: Text magnifier not found');
            return;
        }
        
        // Add hover effects to text elements and interactive elements
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label, li, td, th, img, .logo, .nav-logo, .nav-menu li, .navbar, nav, header, .header, .menu, .nav-item, [role="button"], [role="link"], [role="menuitem"]');
        
        textElements.forEach(element => {
            // Skip accessibility widget elements
            if (element.closest('.accessibility-panel') || element.closest('#accessibility-icon')) {
                return;
            }
            
            element.addEventListener('mouseenter', (e) => {
                // Show magnified text in semi-transparent black box
                if (magnifier && element.textContent && element.textContent.trim()) {
                    // Get the full text content, including nested elements
                    let fullText = '';
                    
                    // Handle different types of elements
                    if (element.tagName === 'IMG') {
                        // For images, use alt text or title
                        fullText = element.alt || element.title || 'Image';
                    } else if (element.hasAttribute('aria-label')) {
                        // For elements with aria-label
                        fullText = element.getAttribute('aria-label');
                    } else if (element.hasAttribute('title')) {
                        // For elements with title attribute
                        fullText = element.getAttribute('title');
                    } else if (element.children.length > 0) {
                        // If element has children, get text from all child elements
                        fullText = element.innerText || element.textContent;
                    } else {
                        // If it's a simple text element
                        fullText = element.textContent || element.innerText;
                    }
                    
                    // Clean up the text (remove extra whitespace)
                    fullText = fullText.replace(/\s+/g, ' ').trim();
                    
                    if (fullText) {
                        // Calculate position to keep popup within viewport
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        
                        // Set initial position
                        let left = e.clientX + 20;
                        let top = e.clientY - 50;
                        
                        // After setting content, we'll adjust position if needed
                        magnifier.style.left = left + 'px';
                        magnifier.style.top = top + 'px';
                        magnifier.style.fontSize = '24px'; // Increased font size
                        magnifier.style.fontWeight = 'bold';
                        magnifier.style.background = 'rgba(0, 0, 0, 0.8)';
                        magnifier.style.color = 'white';
                        magnifier.style.padding = '16px 20px'; // Increased padding
                        magnifier.style.borderRadius = '8px';
                        magnifier.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.5)';
                        magnifier.style.zIndex = '1000000';
                        magnifier.style.width = 'auto'; // Auto width based on content
                        magnifier.style.maxWidth = '600px'; // Maximum width limit
                        magnifier.style.wordWrap = 'break-word';
                        magnifier.style.lineHeight = '1.4';
                        magnifier.style.whiteSpace = 'normal'; // Allow text to wrap naturally
                        magnifier.style.overflow = 'visible'; // No scroll, let it grow
                        magnifier.style.height = 'auto'; // Auto height based on content
                        magnifier.textContent = fullText; // Show complete text
                        magnifier.style.display = 'block';
                        
                        // Now adjust position based on actual popup size
                        setTimeout(() => {
                            const popupRect = magnifier.getBoundingClientRect();
                            const popupWidth = popupRect.width;
                            const popupHeight = popupRect.height;
                            
                            // Adjust left position if popup goes off right edge
                            if (left + popupWidth > viewportWidth) {
                                left = e.clientX - popupWidth - 20; // Show to the left of cursor
                                magnifier.style.left = left + 'px';
                            }
                            
                            // Adjust top position if popup goes off bottom
                            if (top + popupHeight > viewportHeight) {
                                top = viewportHeight - popupHeight - 10;
                                magnifier.style.top = top + 'px';
                            }
                        }, 10);
                        
                        // Check if popup goes off top edge
                        if (top < 10) {
                            top = e.clientY + 20; // Show below cursor if too close to top
                            magnifier.style.top = top + 'px';
                        }
                        console.log('Accessibility Widget: Showing full magnified text:', fullText);
                    }
                }
            });
            
            element.addEventListener('mouseleave', (e) => {
                // Hide magnifier
                if (magnifier) {
                    magnifier.style.display = 'none';
                }
            });
        });
        
        console.log('Accessibility Widget: Text magnifier enabled with hover effects on', textElements.length, 'elements');
    }

    disableTextMagnifier() {
        const magnifier = document.getElementById('text-magnifier');
        if (magnifier) {
            magnifier.style.display = 'none';
        }
        
        // Remove hover effects from text elements and interactive elements
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button, label, li, td, th, img, .logo, .nav-logo, .nav-menu li, .navbar, nav, header, .header, .menu, .nav-item, [role="button"], [role="link"], [role="menuitem"]');
        
        textElements.forEach(element => {
            // Skip accessibility widget elements
            if (element.closest('.accessibility-panel') || element.closest('#accessibility-icon')) {
                return;
            }
            
            // Remove highlight effects
            element.style.background = '';
            element.style.border = '';
            element.style.borderRadius = '';
            element.style.padding = '';
            element.style.boxShadow = '';
            element.style.transform = '';
            element.style.transition = '';
            
            // Remove event listeners by cloning and replacing
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
        });
        
        console.log('Accessibility Widget: Text magnifier disabled');
    }

    enableFontSizing() {
        // Use the inline controls instead of creating separate panel
        this.showFontSizingControls();
        console.log('Accessibility Widget: Font sizing enabled');
        
        // Test if controls exist
        const controls = document.getElementById('font-sizing-controls');
        if (controls) {
            console.log('Accessibility Widget: Font sizing controls found');
        } else {
            console.error('Accessibility Widget: Font sizing controls not found');
        }
    }

    disableFontSizing() {
        const controls = document.getElementById('font-size-controls');
        if (controls) controls.remove();
    }

    changeFontSize(factor) {
        const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
        document.body.style.fontSize = (currentSize * factor) + 'px';
    }

    resetFontSize() {
        document.body.style.fontSize = '';
    }

    // Font Size Methods
    increaseFontSize() {
        this.fontSize = Math.min(this.fontSize + 10, 200);
        this.updateFontSize();
        this.updateFontSizeDisplay();
    }

    decreaseFontSize() {
        this.fontSize = Math.max(this.fontSize - 10, 50);
        this.updateFontSize();
        this.updateFontSizeDisplay();
    }

    updateFontSize() {
        const scale = this.fontSize / 100;
        document.body.style.fontSize = `${scale * 16}px`;
    }

    updateFontSizeDisplay() {
        const display = document.getElementById('font-size-value');
        if (display) {
            display.textContent = this.fontSize + '%';
        }
    }

    // Line Height Methods
    increaseLineHeight() {
        this.lineHeight = Math.min(this.lineHeight + 10, 200);
        this.updateLineHeight();
        this.updateLineHeightDisplay();
    }

    decreaseLineHeight() {
        this.lineHeight = Math.max(this.lineHeight - 10, 50);
        this.updateLineHeight();
        this.updateLineHeightDisplay();
    }

    updateLineHeight() {
        const scale = this.lineHeight / 100;
        document.body.style.lineHeight = scale;
    }

    updateLineHeightDisplay() {
        const display = document.getElementById('line-height-value');
        if (display) {
            display.textContent = this.lineHeight + '%';
        }
    }

    // Content Scaling Methods
    increaseContentScale() {
        this.contentScale = Math.min(this.contentScale + 5, 200); // 5% increment
        this.updateContentScale();
        this.updateContentScaleDisplay();
    }

    decreaseContentScale() {
        this.contentScale = Math.max(this.contentScale - 5, 50); // 5% decrement, minimum 50%
        this.updateContentScale();
        this.updateContentScaleDisplay();
    }

    updateContentScale() {
        const scale = this.contentScale / 100;
        
        // Apply scaling to the entire website body
        const body = document.body;
        const html = document.documentElement;
        
        // Skip accessibility widget elements from scaling
        const accessibilityElements = document.querySelectorAll('.accessibility-panel, #accessibility-icon, .accessibility-icon');
        accessibilityElements.forEach(element => {
            element.style.transform = 'scale(1)'; // Keep accessibility widget at normal size
            element.style.transformOrigin = 'center center';
        });
        
        // Scale the entire body
        body.style.transform = `scale(${scale})`;
        body.style.transformOrigin = 'top left';
        body.style.width = `${100 / scale}%`;
        body.style.height = `${100 / scale}%`;
        
        // Ensure content stays within viewport
        html.style.overflow = 'hidden';
        html.style.maxWidth = '100vw';
        html.style.maxHeight = '100vh';
        
        console.log('Accessibility Widget: Content scaled to', this.contentScale + '%');
    }

    updateContentScaleDisplay() {
        const display = document.getElementById('content-scale-value');
        if (display) {
            display.textContent = this.contentScale + '%';
        }
    }

    // Font Size Methods
    increaseFontSize() {
        this.fontSize = Math.min(this.fontSize + 10, 200);
        this.updateFontSize();
        this.updateFontSizeDisplay();
    }

    decreaseFontSize() {
        this.fontSize = Math.max(this.fontSize - 10, 50);
        this.updateFontSize();
        this.updateFontSizeDisplay();
    }

    updateFontSize() {
        const scale = this.fontSize / 100;
        document.body.style.fontSize = `${scale * 16}px`;
    }

    updateFontSizeDisplay() {
        const display = document.getElementById('font-size-value');
        if (display) {
            display.textContent = this.fontSize + '%';
        }
    }

    // Font Size Methods
    increaseFontSize() {
        console.log('Accessibility Widget: increaseFontSize called');
        this.fontSize = Math.min(this.fontSize + 10, 200);
        this.updateFontSizeEnhanced();
        this.updateFontSizeDisplay();
        console.log('Accessibility Widget: Font size increased to', this.fontSize + '%');
    }

    decreaseFontSize() {
        console.log('Accessibility Widget: decreaseFontSize called');
        this.fontSize = Math.max(this.fontSize - 10, 50);
        this.updateFontSizeEnhanced();
        this.updateFontSizeDisplay();
        console.log('Accessibility Widget: Font size decreased to', this.fontSize + '%');
    }

    // Line Height Methods
    increaseLineHeight() {
        this.lineHeight = Math.min(this.lineHeight + 10, 200);
        this.updateLineHeight();
        this.updateLineHeightDisplay();
    }

    decreaseLineHeight() {
        console.log('Accessibility Widget: decreaseLineHeight called, current value:', this.lineHeight);
        
        // Simple decrement - no special handling for first click
        this.lineHeight = Math.max(this.lineHeight - 10, 50);
        
        this.updateLineHeight();
        this.updateLineHeightDisplay();
        console.log('Accessibility Widget: Line height decreased to', this.lineHeight + '%');
    }

    updateLineHeight() {
        const scale = this.lineHeight / 100;
        document.body.style.lineHeight = scale;
    }

    updateLineHeightDisplay() {
        const display = document.getElementById('line-height-value');
        if (display) {
            display.textContent = this.lineHeight + '%';
        }
    }

    // Letter Spacing Methods
    increaseLetterSpacing() {
        console.log('Accessibility Widget: increaseLetterSpacing called');
        this.letterSpacing = Math.min(this.letterSpacing + 10, 200);
        this.updateLetterSpacing();
        this.updateLetterSpacingDisplay();
        console.log('Accessibility Widget: Letter spacing increased to', this.letterSpacing + '%');
    }

    decreaseLetterSpacing() {
        console.log('Accessibility Widget: decreaseLetterSpacing called');
        this.letterSpacing = Math.max(this.letterSpacing - 10, 50);
        this.updateLetterSpacing();
        this.updateLetterSpacingDisplay();
        console.log('Accessibility Widget: Letter spacing decreased to', this.letterSpacing + '%');
    }

    updateLetterSpacing() {
        const scale = this.letterSpacing / 100;
        const letterSpacingValue = `${scale * 0.5}px`;
        
        // Apply to body
        document.body.style.letterSpacing = letterSpacingValue;
        
        // Apply to all text elements except accessibility panel
        const textElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b, h1, h2, h3, h4, h5, h6, a, button, input, textarea, select');
        
        textElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.letterSpacing = letterSpacingValue;
            }
        });
        
        console.log('Accessibility Widget: Letter spacing updated to', this.letterSpacing + '%');
    }

    // Enhanced font size method
    updateFontSizeEnhanced() {
        const scale = this.fontSize / 100;
        const baseFontSize = scale * 16;
        
        // Apply to body
        document.body.style.fontSize = `${baseFontSize}px`;
        
        // Apply to all text elements except accessibility panel
        const textElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b, h1, h2, h3, h4, h5, h6, a, button, input, textarea, select');
        
        textElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                // Get current font size and scale it
                const currentSize = parseFloat(window.getComputedStyle(element).fontSize);
                if (currentSize && !isNaN(currentSize)) {
                    element.style.fontSize = `${currentSize * scale}px`;
                }
            }
        });
        
        console.log('Accessibility Widget: Font size updated to', this.fontSize + '%');
    }

    updateLetterSpacingDisplay() {
        const display = document.getElementById('letter-spacing-value');
        if (display) {
            display.textContent = this.letterSpacing + '%';
        }
    }

    // Control Show/Hide Methods
    showContentScalingControls() {
        const controls = document.getElementById('content-scaling-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hideContentScalingControls() {
        const controls = document.getElementById('content-scaling-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    showFontSizingControls() {
        const controls = document.getElementById('font-sizing-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hideFontSizingControls() {
        const controls = document.getElementById('font-sizing-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    showLineHeightControls() {
        const controls = document.getElementById('line-height-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hideLineHeightControls() {
        const controls = document.getElementById('line-height-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    // Reset Methods
    resetContentScale() {
        this.contentScale = 100; // Reset to 100% (normal size)
        
        // Reset body scaling
        const body = document.body;
        const html = document.documentElement;
        
        body.style.transform = '';
        body.style.transformOrigin = '';
        body.style.width = '';
        body.style.height = '';
        
        // Reset accessibility widget elements
        const accessibilityElements = document.querySelectorAll('.accessibility-panel, #accessibility-icon, .accessibility-icon');
        accessibilityElements.forEach(element => {
            element.style.transform = '';
            element.style.transformOrigin = '';
        });
        
        // Reset container overflow restrictions
        html.style.overflow = '';
        html.style.maxWidth = '';
        html.style.maxHeight = '';
        
        this.updateContentScaleDisplay();
        console.log('Accessibility Widget: Content scale reset to 100%');
    }

    resetLineHeight() {
        this.lineHeight = 100;
        document.body.style.lineHeight = '';
        this.updateLineHeightDisplay();
    }

    resetLetterSpacing() {
        this.letterSpacing = 100;
        document.body.style.letterSpacing = '';
        this.updateLetterSpacingDisplay();
    }

    // Control Show/Hide Methods
    showContentScalingControls() {
        const controls = document.getElementById('content-scaling-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hideContentScalingControls() {
        const controls = document.getElementById('content-scaling-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    showFontSizingControls() {
        const controls = document.getElementById('font-sizing-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hideFontSizingControls() {
        const controls = document.getElementById('font-sizing-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    showLineHeightControls() {
        const controls = document.getElementById('line-height-controls');
        if (controls) {
            controls.style.display = 'block';
        }
    }

    hideLineHeightControls() {
        const controls = document.getElementById('line-height-controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    // Reset Methods
    resetContentScale() {
        this.contentScale = 100; // Reset to 100% (normal size)
        
        // Reset body scaling
        const body = document.body;
        const html = document.documentElement;
        
        body.style.transform = '';
        body.style.transformOrigin = '';
        body.style.width = '';
        body.style.height = '';
        
        // Reset accessibility widget elements
        const accessibilityElements = document.querySelectorAll('.accessibility-panel, #accessibility-icon, .accessibility-icon');
        accessibilityElements.forEach(element => {
            element.style.transform = '';
            element.style.transformOrigin = '';
        });
        
        // Reset container overflow restrictions
        html.style.overflow = '';
        html.style.maxWidth = '';
        html.style.maxHeight = '';
        
        this.updateContentScaleDisplay();
        console.log('Accessibility Widget: Content scale reset to 100%');
    }

    resetLineHeight() {
        this.lineHeight = 100;
        document.body.style.lineHeight = '';
        this.updateLineHeightDisplay();
    }

    // Highlight Methods
    highlightTitles() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // Skip if heading is inside accessibility panel
            if (heading.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                return;
            }
            
            // Create a wrapper div around the heading
            if (!heading.dataset.highlighted) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    display: inline-block;
                    border: 2px solid #6366f1;
                    border-radius: 6px;
                    padding: 4px 8px;
                    margin: 2px;
                    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
                    background: transparent;
                `;
                
                // Insert wrapper before heading and move heading inside
                heading.parentNode.insertBefore(wrapper, heading);
                wrapper.appendChild(heading);
                heading.dataset.highlighted = 'true';
            }
        });
    }

    removeTitleHighlights() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // Remove wrapper if it exists
            if (heading.dataset.highlighted && heading.parentNode && heading.parentNode.style.border) {
                const wrapper = heading.parentNode;
                const grandParent = wrapper.parentNode;
                grandParent.insertBefore(heading, wrapper);
                grandParent.removeChild(wrapper);
                delete heading.dataset.highlighted;
            }
        });
    }

    highlightLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // Create a wrapper div around the link
            if (!link.dataset.highlighted) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    display: inline-block;
                    border: 2px solid #6366f1;
                    border-radius: 4px;
                    padding: 2px 4px;
                    margin: 1px;
                    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
                    background: transparent;
                `;
                
                // Insert wrapper before link and move link inside
                link.parentNode.insertBefore(wrapper, link);
                wrapper.appendChild(link);
                link.dataset.highlighted = 'true';
            }
        });
    }

    removeLinkHighlights() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            // Remove wrapper if it exists
            if (link.dataset.highlighted && link.parentNode && link.parentNode.style.border) {
                const wrapper = link.parentNode;
                const grandParent = wrapper.parentNode;
                grandParent.insertBefore(link, wrapper);
                grandParent.removeChild(wrapper);
                delete link.dataset.highlighted;
            }
        });
    }

    showColorPicker(type) {
        const color = prompt(`Enter ${type} color (hex code):`, '#000000');
        if (color) {
            document.documentElement.style.setProperty(`--custom-${type}-color`, color);
            document.body.classList.add(`custom-${type}-color`);
        }
    }

    showUsefulLinks() {
        const links = [
            { name: 'WCAG Guidelines', url: 'https://www.w3.org/WAI/WCAG21/quickref/' },
            { name: 'WebAIM', url: 'https://webaim.org/' },
            { name: 'A11Y Project', url: 'https://www.a11yproject.com/' },
            { name: 'Color Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/' }
        ];
        
        let message = 'Useful Accessibility Resources:\n\n';
        links.forEach(link => {
            message += `${link.name}: ${link.url}\n`;
        });
        
        alert(message);
    }

    showStatement() {
        alert('This website is committed to providing an accessible experience for all users. We follow WCAG 2.1 guidelines and continuously work to improve accessibility.');
    }

    resetSettings() {
        this.settings = {};
        this.saveSettings();
        this.applySettings();
        
        // Remove all accessibility classes
        const body = document.body;
        const classes = body.className.split(' ').filter(cls => 
            !cls.includes('-') || cls.includes('accessibility')
        );
        body.className = classes.join(' ');
        
        // Reset scaling values
        this.contentScale = 100; // Reset to 100% (normal size)
        this.fontSize = 100;
        this.lineHeight = 100;
        this.letterSpacing = 100;
        
        // Reset font size
        this.resetFontSize();
        
        // Reset content scale
        this.resetContentScale();
        
        // Reset line height
        this.resetLineHeight();
        
        // Reset letter spacing
        this.resetLetterSpacing();
        
        // Disable text magnifier
        this.disableTextMagnifier();
        
        // Remove font size controls
        this.disableFontSizing();
        
        // Hide all scaling controls
        this.hideContentScalingControls();
        this.hideFontSizingControls();
        this.hideLineHeightControls();
        this.hideLetterSpacingControls();
        
        // Remove highlights
        this.removeTitleHighlights();
        this.removeLinkHighlights();
        
        // Disable high contrast and saturation
        this.disableHighContrast();
        this.disableHighSaturation();
        this.disableDarkContrast();
        this.disableLightContrast();
        
        // Reset text colors
        this.resetTextColors();
        this.hideTextColorPicker();
        this.resetTitleColors();
        this.hideTitleColorPicker();
        this.resetBackgroundColors();
        this.hideBackgroundColorPicker();
        
        // Disable all profiles
        this.disableSeizureSafe();
        this.disableVisionImpaired();
        this.disableADHDFriendly();
        this.disableCognitiveDisability();
        this.disableReadableFont();
        
        // Remove cognitive boxes
        this.removeCognitiveBoxes();
        
        // Remove ADHD spotlight
        this.removeADHDSpotlight();
        
        // Reset custom colors
        document.documentElement.style.removeProperty('--custom-text-color');
        document.documentElement.style.removeProperty('--custom-title-color');
        document.documentElement.style.removeProperty('--custom-bg-color');
        
        // Reset all toggles
        const toggles = document.querySelectorAll('.toggle-switch input');
        toggles.forEach(toggle => {
            toggle.checked = false;
        });
    }

    loadSettings() {
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
            this.settings = JSON.parse(saved);
        }
        
        // Set default settings for keyboard navigation if not already set
        if (this.settings['keyboard-nav'] === undefined) {
            this.settings['keyboard-nav'] = true; // Enable by default
            console.log('Accessibility Widget: Setting keyboard navigation to enabled by default');
        }
        
        // Force enable keyboard navigation for testing
        this.settings['keyboard-nav'] = true;
        console.log('Accessibility Widget: Forcing keyboard navigation to enabled');
        
        // Ensure line height is always initialized to 100%
        this.lineHeight = 100;
        console.log('Accessibility Widget: Line height initialized to 100%');
        
        console.log('Accessibility Widget: Loaded settings:', this.settings);
    }

    saveSettings() {
        localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
    }

    applySettings() {
        console.log('Accessibility Widget: Applying settings:', this.settings);
        
        Object.entries(this.settings).forEach(([feature, enabled]) => {
            console.log(`Accessibility Widget: Processing feature ${feature}: ${enabled}`);
            if (enabled) {
                this.applyFeature(feature, true);
                const toggle = document.getElementById(feature);
                if (toggle) toggle.checked = true;
            }
        });
        
        // Initialize keyboard shortcuts if keyboard navigation is enabled
        if (this.settings['keyboard-nav']) {
            console.log('Accessibility Widget: Keyboard navigation enabled in settings, initializing shortcuts');
            this.initKeyboardShortcuts();
        } else {
            console.log('Accessibility Widget: Keyboard navigation not enabled in settings');
            console.log('Accessibility Widget: Available settings keys:', Object.keys(this.settings));
        }
    }

    // Add missing letter spacing control methods
    showLetterSpacingControls() {
        console.log('Accessibility Widget: showLetterSpacingControls called');
        const controls = document.getElementById('letter-spacing-controls');
        if (controls) {
            controls.style.display = 'block';
            console.log('Accessibility Widget: Letter spacing controls shown');
        } else {
            console.error('Accessibility Widget: Letter spacing controls not found');
        }
    }

    hideLetterSpacingControls() {
        const controls = document.getElementById('letter-spacing-controls');
        if (controls) {
            controls.style.display = 'none';
            console.log('Accessibility Widget: Letter spacing controls hidden');
        }
    }

    // Handle toggle events
    handleToggle(feature, enabled) {
        console.log(`Accessibility Widget: Handling toggle for ${feature}: ${enabled}`);
        
        // Save setting
        this.settings[feature] = enabled;
        this.saveSettings();
        
        // Apply feature
        this.applyFeature(feature, enabled);
    }

    // Apply individual features
    applyFeature(feature, enabled) {
        console.log(`Accessibility Widget: Applying feature ${feature}: ${enabled}`);
        
        switch(feature) {
            case 'high-contrast':
                if (enabled) {
                    this.enableHighContrast();
                } else {
                    this.disableHighContrast();
                }
                break;
                
            case 'high-saturation':
                if (enabled) {
                    this.enableHighSaturation();
                } else {
                    this.disableHighSaturation();
                }
                break;
                
            case 'monochrome':
                if (enabled) {
                    this.enableMonochrome();
                } else {
                    this.disableMonochrome();
                }
                break;
                
            case 'dark-contrast':
                if (enabled) {
                    this.enableDarkContrast();
                } else {
                    this.disableDarkContrast();
                }
                break;
                
            case 'light-contrast':
                if (enabled) {
                    this.enableLightContrast();
                } else {
                    this.disableLightContrast();
                }
                break;
                
            case 'adjust-text-colors':
                if (enabled) {
                    this.showTextColorPicker();
                } else {
                    this.hideTextColorPicker();
                    this.resetTextColors();
                }
                break;
                
            case 'adjust-title-colors':
                if (enabled) {
                    this.showTitleColorPicker();
                } else {
                    this.hideTitleColorPicker();
                    this.resetTitleColors();
                }
                break;
                
            case 'adjust-bg-colors':
                if (enabled) {
                    this.showBackgroundColorPicker();
                } else {
                    this.hideBackgroundColorPicker();
                    this.resetBackgroundColors();
                }
                break;
                
            case 'seizure-safe':
                if (enabled) {
                    this.enableSeizureSafe();
                } else {
                    this.disableSeizureSafe();
                }
                break;
                
            case 'vision-impaired':
                if (enabled) {
                    this.enableVisionImpaired();
                } else {
                    this.disableVisionImpaired();
                }
                break;
                
            case 'adhd-friendly':
                if (enabled) {
                    this.enableADHDFriendly();
                } else {
                    this.disableADHDFriendly();
                }
                break;
                
            case 'cognitive-disability':
                if (enabled) {
                    this.enableCognitiveDisability();
                } else {
                    this.disableCognitiveDisability();
                }
                break;
                
            case 'readable-font':
                if (enabled) {
                    this.enableReadableFont();
                } else {
                    this.disableReadableFont();
                }
                break;
                
            case 'content-scaling':
                if (enabled) {
                    this.showContentScalingControls();
                } else {
                    this.hideContentScalingControls();
                    this.resetContentScale();
                }
                break;
                
            case 'font-sizing':
                if (enabled) {
                    this.enableFontSizing();
                } else {
                    this.hideFontSizingControls();
                    this.resetFontSize();
                }
                break;
                
            case 'adjust-line-height':
                if (enabled) {
                    this.showLineHeightControls();
                } else {
                    this.hideLineHeightControls();
                    this.resetLineHeight();
                }
                break;
                
            case 'adjust-letter-spacing':
                if (enabled) {
                    this.showLetterSpacingControls();
                } else {
                    this.hideLetterSpacingControls();
                    this.resetLetterSpacing();
                }
                break;
                
            case 'align-center':
                if (enabled) {
                    this.enableAlignCenter();
                } else {
                    this.disableAlignCenter();
                }
                break;
                
            case 'align-left':
                if (enabled) {
                    this.enableAlignLeft();
                } else {
                    this.disableAlignLeft();
                }
                break;
                
            case 'align-right':
                if (enabled) {
                    this.enableAlignRight();
                } else {
                    this.disableAlignRight();
                }
                break;
                
            case 'highlight-titles':
                if (enabled) {
                    this.highlightTitles();
                } else {
                    this.removeTitleHighlights();
                }
                break;
                
            case 'highlight-links':
                if (enabled) {
                    this.highlightLinks();
                } else {
                    this.removeLinkHighlights();
                }
                break;
                
            case 'text-magnifier':
                if (enabled) {
                    this.enableTextMagnifier();
                } else {
                    this.disableTextMagnifier();
                }
                break;
                
            case 'keyboard-nav':
                if (enabled) {
                    this.initKeyboardShortcuts();
                } else {
                    this.removeKeyboardShortcuts();
                }
                break;
                
            default:
                console.log(`Accessibility Widget: Unknown feature: ${feature}`);
        }
    }

    // High Contrast Methods
    enableHighContrast() {
        console.log('Accessibility Widget: enableHighContrast called');
        document.body.classList.add('high-contrast');
        console.log('Accessibility Widget: High contrast enabled');
    }

    disableHighContrast() {
        document.body.classList.remove('high-contrast');
        console.log('Accessibility Widget: High contrast disabled');
    }

    // High Saturation Methods
    enableHighSaturation() {
        document.body.classList.add('high-saturation');
        console.log('Accessibility Widget: High saturation enabled');
    }

    disableHighSaturation() {
        document.body.classList.remove('high-saturation');
        console.log('Accessibility Widget: High saturation disabled');
    }

    // Monochrome Methods
    enableMonochrome() {
        document.body.classList.add('monochrome');
        console.log('Accessibility Widget: Monochrome enabled');
    }

    disableMonochrome() {
        document.body.classList.remove('monochrome');
        console.log('Accessibility Widget: Monochrome disabled');
    }

    // Dark Contrast Methods
    enableDarkContrast() {
        console.log('Accessibility Widget: enableDarkContrast called');
        document.body.classList.add('dark-contrast');
        console.log('Accessibility Widget: Dark contrast enabled');
    }

    disableDarkContrast() {
        document.body.classList.remove('dark-contrast');
        console.log('Accessibility Widget: Dark contrast disabled');
    }

    // Light Contrast Methods
    enableLightContrast() {
        console.log('Accessibility Widget: enableLightContrast called');
        document.body.classList.add('light-contrast');
        console.log('Accessibility Widget: Light contrast enabled');
    }

    disableLightContrast() {
        document.body.classList.remove('light-contrast');
        console.log('Accessibility Widget: Light contrast disabled');
    }

    // Text Color Picker Methods
    showTextColorPicker() {
        console.log('Accessibility Widget: showTextColorPicker called');
        
        // Remove existing color picker if any
        this.hideTextColorPicker();
        
        // Find the adjust-text-colors module in the panel
        const textColorsModule = document.querySelector('#adjust-text-colors').closest('.profile-item');
        
        if (textColorsModule) {
            // Create color picker content
            const colorPicker = document.createElement('div');
            colorPicker.id = 'text-color-picker';
            colorPicker.className = 'color-picker-inline';
            colorPicker.innerHTML = `
                <div class="color-picker-content">
                    <h4>Adjust Text Colors</h4>
                    <div class="color-options">
                        <div class="color-option" data-color="#3b82f6" style="background-color: #3b82f6;"></div>
                        <div class="color-option selected" data-color="#8b5cf6" style="background-color: #8b5cf6;"></div>
                        <div class="color-option" data-color="#ef4444" style="background-color: #ef4444;"></div>
                        <div class="color-option" data-color="#f97316" style="background-color: #f97316;"></div>
                        <div class="color-option" data-color="#14b8a6" style="background-color: #14b8a6;"></div>
                        <div class="color-option" data-color="#84cc16" style="background-color: #84cc16;"></div>
                        <div class="color-option" data-color="#ffffff" style="background-color: #ffffff; border: 1px solid #ccc;"></div>
                        <div class="color-option" data-color="#000000" style="background-color: #000000;"></div>
                    </div>
                    <button class="cancel-btn" onclick="accessibilityWidget.hideTextColorPicker()">Cancel</button>
                </div>
            `;
            
            // Insert after the profile-info div, before the toggle switch
            const profileInfo = textColorsModule.querySelector('.profile-info');
            const toggleSwitch = textColorsModule.querySelector('.toggle-switch');
            textColorsModule.insertBefore(colorPicker, toggleSwitch);
            
            // Add event listeners to color options
            const colorOptions = colorPicker.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    this.applyTextColor(color);
                    
                    // Update selected state
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    e.target.classList.add('selected');
                });
            });
            
            // Add event listener to cancel button
            const cancelBtn = colorPicker.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.resetTextColors();
                    this.hideTextColorPicker();
                });
            }
            
            console.log('Accessibility Widget: Text color picker shown in panel');
        } else {
            console.error('Accessibility Widget: Could not find adjust-text-colors module');
        }
    }

    hideTextColorPicker() {
        const colorPicker = document.getElementById('text-color-picker');
        if (colorPicker) {
            colorPicker.remove();
            console.log('Accessibility Widget: Text color picker hidden');
        }
    }

    applyTextColor(color) {
        console.log('Accessibility Widget: Applying text color:', color);
        
        // Apply color to all text elements except buttons, headings, and links
        const textElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b');
        
        textElements.forEach(element => {
            // Skip if element is inside a button, heading, link, or accessibility panel
            if (!element.closest('button, h1, h2, h3, h4, h5, h6, a, .btn, .accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.color = color;
            }
        });
        
        // Apply color to menu text specifically (but not accessibility panel menu)
        const menuElements = document.querySelectorAll('.nav-menu li a, .navbar a, nav a, .menu a, .nav-item a');
        menuElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.color = color;
            }
        });
        
        // Store the selected color
        this.selectedTextColor = color;
        console.log('Accessibility Widget: Text color applied to elements (excluding accessibility panel)');
    }

    resetTextColors() {
        console.log('Accessibility Widget: Resetting text colors');
        
        // Remove custom text colors
        const textElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b');
        textElements.forEach(element => {
            if (!element.closest('button, h1, h2, h3, h4, h5, h6, a, .btn, .accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.color = '';
            }
        });
        
        // Reset menu colors (but not accessibility panel menu)
        const menuElements = document.querySelectorAll('.nav-menu li a, .navbar a, nav a, .menu a, .nav-item a');
        menuElements.forEach(element => {
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.color = '';
            }
        });
        
        this.selectedTextColor = null;
        console.log('Accessibility Widget: Text colors reset (excluding accessibility panel)');
    }

    // Title Color Picker Methods
    showTitleColorPicker() {
        console.log('Accessibility Widget: showTitleColorPicker called');
        
        // Remove existing color picker if any
        this.hideTitleColorPicker();
        
        // Find the adjust-title-colors module in the panel
        const titleColorsModule = document.querySelector('#adjust-title-colors').closest('.profile-item');
        
        if (titleColorsModule) {
            // Create color picker content
            const colorPicker = document.createElement('div');
            colorPicker.id = 'title-color-picker';
            colorPicker.className = 'color-picker-inline';
            colorPicker.innerHTML = `
                <div class="color-picker-content">
                    <h4>Adjust Title Colors</h4>
                    <div class="color-options">
                        <div class="color-option" data-color="#3b82f6" style="background-color: #3b82f6;"></div>
                        <div class="color-option" data-color="#8b5cf6" style="background-color: #8b5cf6;"></div>
                        <div class="color-option" data-color="#ef4444" style="background-color: #ef4444;"></div>
                        <div class="color-option selected" data-color="#f97316" style="background-color: #f97316;"></div>
                        <div class="color-option" data-color="#14b8a6" style="background-color: #14b8a6;"></div>
                        <div class="color-option" data-color="#84cc16" style="background-color: #84cc16;"></div>
                        <div class="color-option" data-color="#ffffff" style="background-color: #ffffff; border: 1px solid #ccc;"></div>
                        <div class="color-option" data-color="#000000" style="background-color: #000000;"></div>
                    </div>
                    <button class="cancel-btn" onclick="accessibilityWidget.hideTitleColorPicker()">Cancel</button>
                </div>
            `;
            
            // Insert after the profile-info div, before the toggle switch
            const profileInfo = titleColorsModule.querySelector('.profile-info');
            const toggleSwitch = titleColorsModule.querySelector('.toggle-switch');
            titleColorsModule.insertBefore(colorPicker, toggleSwitch);
            
            // Add event listeners to color options
            const colorOptions = colorPicker.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    this.applyTitleColor(color);
                    
                    // Update selected state
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    e.target.classList.add('selected');
                });
            });
            
            // Add event listener to cancel button
            const cancelBtn = colorPicker.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.resetTitleColors();
                    this.hideTitleColorPicker();
                });
            }
            
            console.log('Accessibility Widget: Title color picker shown in panel');
        } else {
            console.error('Accessibility Widget: Could not find adjust-title-colors module');
        }
    }

    hideTitleColorPicker() {
        const colorPicker = document.getElementById('title-color-picker');
        if (colorPicker) {
            colorPicker.remove();
            console.log('Accessibility Widget: Title color picker hidden');
        }
    }

    applyTitleColor(color) {
        console.log('Accessibility Widget: Applying title color:', color);
        
        // Apply color to all heading elements except accessibility panel
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headingElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.color = color;
            }
        });
        
        // Store the selected color
        this.selectedTitleColor = color;
        console.log('Accessibility Widget: Title color applied to', headingElements.length, 'elements (excluding accessibility panel)');
    }

    resetTitleColors() {
        console.log('Accessibility Widget: Resetting title colors');
        
        // Remove custom title colors
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headingElements.forEach(element => {
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.color = '';
            }
        });
        
        this.selectedTitleColor = null;
        console.log('Accessibility Widget: Title colors reset (excluding accessibility panel)');
    }

    // Background Color Picker Methods
    showBackgroundColorPicker() {
        console.log('Accessibility Widget: showBackgroundColorPicker called');
        
        // Remove existing color picker if any
        this.hideBackgroundColorPicker();
        
        // Find the adjust-bg-colors module in the panel
        const bgColorsModule = document.querySelector('#adjust-bg-colors').closest('.profile-item');
        
        if (bgColorsModule) {
            // Create color picker content
            const colorPicker = document.createElement('div');
            colorPicker.id = 'bg-color-picker';
            colorPicker.className = 'color-picker-inline';
            colorPicker.innerHTML = `
                <div class="color-picker-content">
                    <h4>Adjust Background Colors</h4>
                    <div class="color-options">
                        <div class="color-option" data-color="#3b82f6" style="background-color: #3b82f6;"></div>
                        <div class="color-option" data-color="#8b5cf6" style="background-color: #8b5cf6;"></div>
                        <div class="color-option" data-color="#ef4444" style="background-color: #ef4444;"></div>
                        <div class="color-option selected" data-color="#f97316" style="background-color: #f97316;"></div>
                        <div class="color-option" data-color="#14b8a6" style="background-color: #14b8a6;"></div>
                        <div class="color-option" data-color="#84cc16" style="background-color: #84cc16;"></div>
                        <div class="color-option" data-color="#ffffff" style="background-color: #ffffff; border: 1px solid #ccc;"></div>
                        <div class="color-option" data-color="#000000" style="background-color: #000000;"></div>
                    </div>
                    <button class="cancel-btn" onclick="accessibilityWidget.hideBackgroundColorPicker()">Cancel</button>
                </div>
            `;
            
            // Insert after the profile-info div, before the toggle switch
            const profileInfo = bgColorsModule.querySelector('.profile-info');
            const toggleSwitch = bgColorsModule.querySelector('.toggle-switch');
            bgColorsModule.insertBefore(colorPicker, toggleSwitch);
            
            // Add event listeners to color options
            const colorOptions = colorPicker.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    const color = e.target.dataset.color;
                    this.applyBackgroundColor(color);
                    
                    // Update selected state
                    colorOptions.forEach(opt => opt.classList.remove('selected'));
                    e.target.classList.add('selected');
                });
            });
            
            // Add event listener to cancel button
            const cancelBtn = colorPicker.querySelector('.cancel-btn');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    this.resetBackgroundColors();
                    this.hideBackgroundColorPicker();
                });
            }
            
            console.log('Accessibility Widget: Background color picker shown in panel');
        } else {
            console.error('Accessibility Widget: Could not find adjust-bg-colors module');
        }
    }

    hideBackgroundColorPicker() {
        const colorPicker = document.getElementById('bg-color-picker');
        if (colorPicker) {
            colorPicker.remove();
            console.log('Accessibility Widget: Background color picker hidden');
        }
    }

    applyBackgroundColor(color) {
        console.log('Accessibility Widget: Applying background color:', color);
        
        // Apply background color to html and body for full website coverage
        document.documentElement.style.backgroundColor = color;
        document.body.style.backgroundColor = color;
        
        // Apply to all main content areas
        const mainContentAreas = document.querySelectorAll('html, body, div, section, article, main, aside, header, footer, nav, .container, .hero, .about, .services, .test-section, .hero-content, .about-content, .services-grid, .service-card, .test-block');
        
        mainContentAreas.forEach(element => {
            // Skip accessibility panel elements
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                // Force background color on all main content areas
                element.style.backgroundColor = color;
            }
        });
        
        // Also apply to any remaining elements that might have backgrounds
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            // Skip accessibility panel elements and elements that already have the color
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon') && 
                element.style.backgroundColor !== color) {
                
                // Check if element has a background that's not transparent
                const computedStyle = window.getComputedStyle(element);
                const bgColor = computedStyle.backgroundColor;
                
                // If element has a background that's not transparent, apply our color
                if (bgColor !== 'rgba(0, 0, 0, 0)' && 
                    bgColor !== 'transparent' && 
                    bgColor !== color &&
                    !element.classList.contains('color-option') && // Don't change color picker colors
                    !element.classList.contains('cancel-btn')) { // Don't change button colors
                    element.style.backgroundColor = color;
                }
            }
        });
        
        // Store the selected color
        this.selectedBackgroundColor = color;
        console.log('Accessibility Widget: Background color applied to entire website');
    }

    resetBackgroundColors() {
        console.log('Accessibility Widget: Resetting background colors');
        
        // Reset html and body background
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
        
        // Reset all main content areas
        const mainContentAreas = document.querySelectorAll('html, body, div, section, article, main, aside, header, footer, nav, .container, .hero, .about, .services, .test-section, .hero-content, .about-content, .services-grid, .service-card, .test-block');
        
        mainContentAreas.forEach(element => {
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                element.style.backgroundColor = '';
            }
        });
        
        // Reset all other elements that might have been changed
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon') &&
                !element.classList.contains('color-option') && 
                !element.classList.contains('cancel-btn')) {
                // Reset if we applied a background color to it
                if (element.style.backgroundColor && element.style.backgroundColor !== '') {
                    element.style.backgroundColor = '';
                }
            }
        });
        
        this.selectedBackgroundColor = null;
        console.log('Accessibility Widget: Background colors reset for entire website');
    }

    // Readable Font Methods
    enableReadableFont() {
        document.body.classList.add('readable-font');
        console.log('Accessibility Widget: Readable font enabled');
    }

    disableReadableFont() {
        document.body.classList.remove('readable-font');
        console.log('Accessibility Widget: Readable font disabled');
    }

    // Seizure Safe Profile Methods
    enableSeizureSafe() {
        document.body.classList.add('seizure-safe');
        console.log('Accessibility Widget: Seizure safe profile enabled');
    }

    disableSeizureSafe() {
        document.body.classList.remove('seizure-safe');
        console.log('Accessibility Widget: Seizure safe profile disabled');
    }

    // Vision Impaired Profile Methods
    enableVisionImpaired() {
        document.body.classList.add('vision-impaired');
        console.log('Accessibility Widget: Vision impaired profile enabled');
    }

    disableVisionImpaired() {
        document.body.classList.remove('vision-impaired');
        console.log('Accessibility Widget: Vision impaired profile disabled');
    }

    // ADHD Friendly Profile Methods
    enableADHDFriendly() {
        document.body.classList.add('adhd-friendly');
        this.createADHDSpotlight();
        console.log('Accessibility Widget: ADHD friendly profile enabled');
    }

    disableADHDFriendly() {
        document.body.classList.remove('adhd-friendly');
        this.removeADHDSpotlight();
        console.log('Accessibility Widget: ADHD friendly profile disabled');
    }

    createADHDSpotlight() {
        // Remove existing spotlight if any
        this.removeADHDSpotlight();
        
        // Create spotlight element
        const spotlight = document.createElement('div');
        spotlight.id = 'adhd-spotlight';
        spotlight.style.cssText = `
            position: fixed;
            width: 100vw;
            height: 150px;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            pointer-events: none;
            z-index: 100001;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            backdrop-filter: brightness(1.2) contrast(1.1);
        `;
        
        document.body.appendChild(spotlight);
        
        // Add mouse move event to follow cursor
        document.addEventListener('mousemove', this.adhdSpotlightHandler);
        
        console.log('Accessibility Widget: ADHD spotlight created');
    }

    removeADHDSpotlight() {
        const spotlight = document.getElementById('adhd-spotlight');
        if (spotlight) {
            spotlight.remove();
        }
        
        // Remove event listener
        document.removeEventListener('mousemove', this.adhdSpotlightHandler);
        
        console.log('Accessibility Widget: ADHD spotlight removed');
    }

    adhdSpotlightHandler = (e) => {
        const spotlight = document.getElementById('adhd-spotlight');
        if (spotlight) {
            const y = e.clientY - 75; // Center the spotlight on cursor (half of 150px height)
            
            // Keep spotlight within viewport bounds
            const maxY = window.innerHeight - 150;
            const clampedY = Math.max(0, Math.min(y, maxY));
            
            // Always maintain full width
            spotlight.style.width = '100vw';
            spotlight.style.left = '0';
            spotlight.style.top = clampedY + 'px';
            spotlight.style.transform = 'none'; // Remove the initial centering transform
        }
    }

    // Cognitive Disability Profile Methods
    enableCognitiveDisability() {
        document.body.classList.add('cognitive-disability');
        this.addCognitiveBoxes();
        console.log('Accessibility Widget: Cognitive disability profile enabled');
    }

    disableCognitiveDisability() {
        document.body.classList.remove('cognitive-disability');
        this.removeCognitiveBoxes();
        console.log('Accessibility Widget: Cognitive disability profile disabled');
    }

    addCognitiveBoxes() {
        // Add boxes around buttons and links (excluding accessibility panel)
        const buttons = document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]');
        const links = document.querySelectorAll('a');
        
        // Process buttons
        buttons.forEach(button => {
            // Skip if button is inside accessibility panel
            if (button.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                return;
            }
            
            // Create wrapper if not already done
            if (!button.dataset.cognitiveBoxed) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    display: inline-block;
                    border: 2px solid #6366f1;
                    border-radius: 6px;
                    padding: 4px 8px;
                    margin: 2px;
                    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
                    background: transparent;
                `;
                
                // Insert wrapper before button and move button inside
                button.parentNode.insertBefore(wrapper, button);
                wrapper.appendChild(button);
                button.dataset.cognitiveBoxed = 'true';
            }
        });
        
        // Process links
        links.forEach(link => {
            // Skip if link is inside accessibility panel
            if (link.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon')) {
                return;
            }
            
            // Create wrapper if not already done
            if (!link.dataset.cognitiveBoxed) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    display: inline-block;
                    border: 2px solid #6366f1;
                    border-radius: 4px;
                    padding: 2px 4px;
                    margin: 1px;
                    box-shadow: 0 2px 6px rgba(99, 102, 241, 0.3);
                    background: transparent;
                `;
                
                // Insert wrapper before link and move link inside
                link.parentNode.insertBefore(wrapper, link);
                wrapper.appendChild(link);
                link.dataset.cognitiveBoxed = 'true';
            }
        });
        
        console.log('Accessibility Widget: Cognitive boxes added to', buttons.length, 'buttons and', links.length, 'links');
    }

    removeCognitiveBoxes() {
        // Remove boxes from buttons
        const buttons = document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]');
        buttons.forEach(button => {
            if (button.dataset.cognitiveBoxed && button.parentNode && button.parentNode.style.border) {
                const wrapper = button.parentNode;
                const grandParent = wrapper.parentNode;
                grandParent.insertBefore(button, wrapper);
                grandParent.removeChild(wrapper);
                delete button.dataset.cognitiveBoxed;
            }
        });
        
        // Remove boxes from links
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.dataset.cognitiveBoxed && link.parentNode && link.parentNode.style.border) {
                const wrapper = link.parentNode;
                const grandParent = wrapper.parentNode;
                grandParent.insertBefore(link, wrapper);
                grandParent.removeChild(wrapper);
                delete link.dataset.cognitiveBoxed;
            }
        });
        
        console.log('Accessibility Widget: Cognitive boxes removed');
    }

    // Text Alignment Methods
    alignTextLeft() {
        console.log('Accessibility Widget: Aligning text left');
        this.applyTextAlignment('left');
    }

    alignTextCenter() {
        console.log('Accessibility Widget: Aligning text center');
        this.applyTextAlignment('center');
    }

    alignTextRight() {
        console.log('Accessibility Widget: Aligning text right');
        this.applyTextAlignment('right');
    }

    applyTextAlignment(alignment) {
        console.log('Accessibility Widget: Applying text alignment:', alignment);
        
        // Apply to document body first
        document.body.style.setProperty('text-align', alignment, 'important');
        
        // Apply to all text elements - be very broad
        const allElements = document.querySelectorAll('*');
        let count = 0;
        
        allElements.forEach(element => {
            // Skip accessibility controls
            if (element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel, #text-alignment-panel, .alignment-toggle-btn')) {
                return;
            }
            
            // Apply to all elements that can contain text
            const tagName = element.tagName.toLowerCase();
            if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'section', 'article', 'main', 'header', 'footer', 'nav', 'li', 'td', 'th', 'blockquote', 'cite', 'address', 'label', 'a'].includes(tagName)) {
                element.style.setProperty('text-align', alignment, 'important');
                count++;
            }
        });
        
        // Also apply to common content classes
        const contentSelectors = [
            '.container', '.hero', '.hero-content', '.hero-text', 
            '.about', '.about-content', '.about-text',
            '.services', '.services-grid', '.service-card',
            '.contact', '.contact-content', '.contact-info',
            '.footer', '.footer-content', '.footer-section',
            '.test-section', '.test-block'
        ];
        
        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel, #text-alignment-panel, .alignment-toggle-btn')) {
                    element.style.setProperty('text-align', alignment, 'important');
                    count++;
                }
            });
        });
        
        console.log('Accessibility Widget: Text alignment', alignment, 'applied to', count, 'elements');
    }

    resetTextAlignment() {
        console.log('Accessibility Widget: Resetting text alignment');
        
        // Reset document body
        document.body.style.removeProperty('text-align');
        
        // Reset all elements - be very broad
        const allElements = document.querySelectorAll('*');
        let count = 0;
        
        allElements.forEach(element => {
            // Skip accessibility controls
            if (element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel, #text-alignment-panel, .alignment-toggle-btn')) {
                return;
            }
            
            // Reset all elements that can contain text
            const tagName = element.tagName.toLowerCase();
            if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'section', 'article', 'main', 'header', 'footer', 'nav', 'li', 'td', 'th', 'blockquote', 'cite', 'address', 'label', 'a'].includes(tagName)) {
                element.style.removeProperty('text-align');
                count++;
            }
        });
        
        // Also reset common content classes
        const contentSelectors = [
            '.container', '.hero', '.hero-content', '.hero-text', 
            '.about', '.about-content', '.about-text',
            '.services', '.services-grid', '.service-card',
            '.contact', '.contact-content', '.contact-info',
            '.footer', '.footer-content', '.footer-section',
            '.test-section', '.test-block'
        ];
        
        contentSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel, #text-alignment-panel, .alignment-toggle-btn')) {
                    element.style.removeProperty('text-align');
                    count++;
                }
            });
        });
        
        console.log('Accessibility Widget: Text alignment reset on', count, 'elements');
    }

    createTextAlignmentControls() {
        // Create text alignment controls
        const alignmentContainer = document.createElement('div');
        alignmentContainer.className = 'alignment-controls';
        alignmentContainer.innerHTML = `
            <div class="control-group">
                <h4>Text Alignment</h4>
                <div class="alignment-buttons">
                    <button id="align-left" class="alignment-btn" title="Align Left">
                        <span style="text-align: left;">⬅</span>
                    </button>
                    <button id="align-center" class="alignment-btn" title="Align Center">
                        <span style="text-align: center;">↔</span>
                    </button>
                    <button id="align-right" class="alignment-btn" title="Align Right">
                        <span style="text-align: right;">➡</span>
                    </button>
                    <button id="reset-alignment" class="alignment-btn" title="Reset Alignment">
                        <span>↺</span>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const alignLeftBtn = alignmentContainer.querySelector('#align-left');
        const alignCenterBtn = alignmentContainer.querySelector('#align-center');
        const alignRightBtn = alignmentContainer.querySelector('#align-right');
        const resetAlignmentBtn = alignmentContainer.querySelector('#reset-alignment');

        alignLeftBtn.addEventListener('click', () => this.alignTextLeft());
        alignCenterBtn.addEventListener('click', () => this.alignTextCenter());
        alignRightBtn.addEventListener('click', () => this.alignTextRight());
        resetAlignmentBtn.addEventListener('click', () => this.resetTextAlignment());

        return alignmentContainer;
    }

    addTextAlignmentToPanel() {
        // Create a floating text alignment panel that works independently
        const alignmentPanel = document.createElement('div');
        alignmentPanel.id = 'text-alignment-panel';
        alignmentPanel.className = 'text-alignment-panel';
        alignmentPanel.innerHTML = `
            <div class="alignment-header">
                <h4>Text Alignment</h4>
                <button id="close-alignment" class="close-btn">×</button>
            </div>
            <div class="alignment-buttons">
                <button id="align-left" class="alignment-btn" title="Align Left">
                    <span style="text-align: left;">⬅</span>
                </button>
                <button id="align-center" class="alignment-btn" title="Align Center">
                    <span style="text-align: center;">↔</span>
                </button>
                <button id="align-right" class="alignment-btn" title="Align Right">
                    <span style="text-align: right;">➡</span>
                </button>
                <button id="reset-alignment" class="alignment-btn" title="Reset Alignment">
                    <span>↺</span>
                </button>
            </div>
        `;

        // Add event listeners
        const alignLeftBtn = alignmentPanel.querySelector('#align-left');
        const alignCenterBtn = alignmentPanel.querySelector('#align-center');
        const alignRightBtn = alignmentPanel.querySelector('#align-right');
        const resetAlignmentBtn = alignmentPanel.querySelector('#reset-alignment');
        const closeBtn = alignmentPanel.querySelector('#close-alignment');

        alignLeftBtn.addEventListener('click', () => this.alignTextLeft());
        alignCenterBtn.addEventListener('click', () => this.alignTextCenter());
        alignRightBtn.addEventListener('click', () => this.alignTextRight());
        resetAlignmentBtn.addEventListener('click', () => this.resetTextAlignment());
        closeBtn.addEventListener('click', () => {
            alignmentPanel.style.display = 'none';
        });

        // Add to body
        document.body.appendChild(alignmentPanel);
        console.log('Accessibility Widget: Text alignment panel created and added to body');

        // Create a toggle button to show/hide the alignment panel
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'alignment-toggle';
        toggleBtn.className = 'alignment-toggle-btn';
        toggleBtn.innerHTML = '📝';
        toggleBtn.title = 'Text Alignment';
        toggleBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: 2px solid #6366f1;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        `;

        toggleBtn.addEventListener('click', () => {
            const isVisible = alignmentPanel.style.display !== 'none';
            alignmentPanel.style.display = isVisible ? 'none' : 'block';
        });

        document.body.appendChild(toggleBtn);
        console.log('Accessibility Widget: Text alignment toggle button created');
        
        // Show the alignment panel by default
        setTimeout(() => {
            alignmentPanel.style.display = 'block';
        }, 500);
    }

    // Add missing resetSettings method
    resetSettings() {
        console.log('Accessibility Widget: Resetting all settings');
        
        // Reset text alignment
        this.resetTextAlignment();
        
        // Reset vision impaired styles
        this.removeVisionImpairedStyles();
        
        // Reset other settings (add more as needed)
        this.contentScale = 100;
        this.fontSize = 100;
        this.lineHeight = 100;
        this.letterSpacing = 100;
        
        console.log('Accessibility Widget: All settings reset');
    }

    // Vision Impaired Profile Methods
    enableVisionImpaired() {
        console.log('Accessibility Widget: Enabling vision impaired profile');
        document.body.classList.add('vision-impaired');
        this.applyVisionImpairedStyles();
    }

    disableVisionImpaired() {
        console.log('Accessibility Widget: Disabling vision impaired profile');
        document.body.classList.remove('vision-impaired');
        this.removeVisionImpairedStyles();
    }

    applyVisionImpairedStyles() {
        // Apply larger font sizes to all text elements including headings
        const textElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b, a, button, input, textarea, select');
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        textElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel')) {
                const currentSize = parseFloat(window.getComputedStyle(element).fontSize);
                if (currentSize && !isNaN(currentSize)) {
                    element.style.fontSize = `${currentSize * 1.5}px`;
                    element.dataset.originalFontSize = currentSize;
                }
            }
        });

        // Apply larger font sizes to headings specifically
        headingElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel')) {
                const currentSize = parseFloat(window.getComputedStyle(element).fontSize);
                if (currentSize && !isNaN(currentSize)) {
                    element.style.fontSize = `${currentSize * 1.5}px`;
                    element.style.fontWeight = 'bold';
                    element.style.lineHeight = '1.4';
                    element.dataset.originalFontSize = currentSize;
                    element.dataset.originalFontWeight = window.getComputedStyle(element).fontWeight;
                    element.dataset.originalLineHeight = window.getComputedStyle(element).lineHeight;
                }
            }
        });

        console.log('Accessibility Widget: Vision impaired styles applied to', textElements.length, 'text elements and', headingElements.length, 'headings');
    }

    removeVisionImpairedStyles() {
        // Remove vision impaired styles from all elements
        const allElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b, a, button, input, textarea, select, h1, h2, h3, h4, h5, h6');
        
        allElements.forEach(element => {
            // Skip if element is inside accessibility panel or text alignment panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel, #text-alignment-panel')) {
                if (element.dataset.originalFontSize) {
                    element.style.fontSize = `${element.dataset.originalFontSize}px`;
                    delete element.dataset.originalFontSize;
                }
                if (element.dataset.originalFontWeight) {
                    element.style.fontWeight = element.dataset.originalFontWeight;
                    delete element.dataset.originalFontWeight;
                }
                if (element.dataset.originalLineHeight) {
                    element.style.lineHeight = element.dataset.originalLineHeight;
                    delete element.dataset.originalLineHeight;
                }
            }
        });

        console.log('Accessibility Widget: Vision impaired styles removed from', allElements.length, 'elements');
    }

    // Text Alignment Methods
    enableAlignCenter() {
        console.log('Accessibility Widget: Enabling center alignment');
        document.body.classList.add('align-center');
        console.log('Accessibility Widget: Center alignment enabled');
    }

    disableAlignCenter() {
        console.log('Accessibility Widget: Disabling center alignment');
        document.body.classList.remove('align-center');
        console.log('Accessibility Widget: Center alignment disabled');
    }

    enableAlignLeft() {
        console.log('Accessibility Widget: Enabling left alignment');
        document.body.classList.add('align-left');
        console.log('Accessibility Widget: Left alignment enabled');
    }

    disableAlignLeft() {
        console.log('Accessibility Widget: Disabling left alignment');
        document.body.classList.remove('align-left');
        console.log('Accessibility Widget: Left alignment disabled');
    }

    enableAlignRight() {
        console.log('Accessibility Widget: Enabling right alignment');
        document.body.classList.add('align-right');
        console.log('Accessibility Widget: Right alignment enabled');
    }

    disableAlignRight() {
        console.log('Accessibility Widget: Disabling right alignment');
        document.body.classList.remove('align-right');
        console.log('Accessibility Widget: Right alignment disabled');
    }

    resetTextAlignment() {
        console.log('Accessibility Widget: Resetting text alignment');
        document.body.classList.remove('align-center', 'align-left', 'align-right');
        console.log('Accessibility Widget: Text alignment reset');
    }

    // Line Height Methods
    showLineHeightControls() {
        console.log('Accessibility Widget: showLineHeightControls called');
        const controls = document.getElementById('line-height-controls');
        if (controls) {
            controls.style.display = 'block';
            // Ensure line height is at 100% when controls are shown
            this.lineHeight = 100;
            this.updateLineHeightDisplay();
            console.log('Accessibility Widget: Line height controls shown, value set to 100%');
        } else {
            console.error('Accessibility Widget: Line height controls not found');
        }
    }

    hideLineHeightControls() {
        const controls = document.getElementById('line-height-controls');
        if (controls) {
            controls.style.display = 'none';
            console.log('Accessibility Widget: Line height controls hidden');
        }
    }

    resetLineHeight() {
        console.log('Accessibility Widget: Resetting line height');
        this.lineHeight = 100; // Reset to 100%
        this.updateLineHeight();
        this.updateLineHeightDisplay();
        console.log('Accessibility Widget: Line height reset to 100%');
    }

    updateLineHeight() {
        // Calculate the line height value
        const lineHeightValue = (this.lineHeight / 100) + 'em';
        
        // Apply to body
        document.body.style.lineHeight = lineHeightValue;
        
        // Apply to all text elements except accessibility panel
        const textElements = document.querySelectorAll('p, span, div, li, td, th, label, small, em, strong, i, b, h1, h2, h3, h4, h5, h6, a, button, input, textarea, select');
        
        textElements.forEach(element => {
            // Skip if element is inside accessibility panel
            if (!element.closest('.accessibility-panel, #accessibility-icon, .accessibility-icon, .text-alignment-panel, #text-alignment-panel')) {
                element.style.lineHeight = lineHeightValue;
            }
        });
    }

    updateLineHeightDisplay() {
        const display = document.getElementById('line-height-value');
        if (display) {
            display.textContent = this.lineHeight + '%';
        }
    }

    increaseLineHeight() {
        console.log('Accessibility Widget: increaseLineHeight called');
        this.lineHeight = Math.min(this.lineHeight + 10, 200);
        this.updateLineHeight();
        this.updateLineHeightDisplay();
        console.log('Accessibility Widget: Line height increased to', this.lineHeight + '%');
    }

    decreaseLineHeight() {
        console.log('Accessibility Widget: decreaseLineHeight called');
        this.lineHeight = Math.max(this.lineHeight - 10, 50);
        this.updateLineHeight();
        this.updateLineHeightDisplay();
        console.log('Accessibility Widget: Line height decreased to', this.lineHeight + '%');
    }
}

// Initialize the widget when DOM is loaded
let accessibilityWidget;

// Wait for DOM to be ready
function initWidget() {
    console.log('Accessibility Widget: Starting initialization...');
    accessibilityWidget = new AccessibilityWidget();
}

// Try multiple ways to initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
} else {
    // DOM is already loaded
    initWidget();
}

// Also try with a small delay as backup
setTimeout(() => {
    if (!accessibilityWidget) {
        console.log('Accessibility Widget: Initializing with timeout...');
        initWidget();
    }
}, 1000);

// Add global error handler for accessibilityWidget
window.addEventListener('error', (e) => {
    if (e.message.includes('accessibilityWidget')) {
        console.error('Accessibility Widget: Error accessing accessibilityWidget object:', e.message);
        console.log('Accessibility Widget: Current accessibilityWidget state:', accessibilityWidget);
    }
});
