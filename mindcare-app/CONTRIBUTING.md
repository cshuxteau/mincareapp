# Contributing to MindCare

Thank you for considering contributing to MindCare! This mental health support application helps individuals and caregivers, and we welcome contributions that improve its accessibility, functionality, and impact.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [How Can I Contribute?](#how-can-i-contribute)
3. [Guidelines](#guidelines)
4. [Development Setup](#development-setup)
5. [Pull Request Process](#pull-request-process)
6. [Style Guidelines](#style-guidelines)
7. [Content Guidelines](#content-guidelines)
8. [Bug Reports](#bug-reports)
9. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming, supportive, and harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members
- Being mindful of mental health sensitivities

**Examples of unacceptable behavior:**
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Stigmatizing mental health conditions
- Providing medical advice without proper credentials
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### 🌍 Translation & Localization
Help make MindCare accessible to non-English speakers:
- Translate interface text
- Adapt crisis resources for different regions
- Localize cultural references in content

**Languages Needed:**
- Spanish
- French
- Mandarin
- German
- Portuguese
- Arabic

### ♿ Accessibility Improvements
- Screen reader compatibility testing
- Keyboard navigation enhancements
- Color contrast improvements
- Alternative text for visual elements

### 📚 Content Contributions
- Additional micro-learning modules (must be evidence-based)
- Caregiver training content
- Communication guides
- Coping strategies

**Requirements:**
- Must cite reputable sources (APA, NIMH, NAMI, etc.)
- Reviewed by mental health professionals
- Non-judgmental, empathetic tone
- Accessible language (8th-grade reading level)

### 🐛 Bug Fixes
- Report bugs with detailed reproduction steps
- Submit fixes with tests
- Update documentation if needed

### ✨ New Features
- Propose features via GitHub Issues first
- Discuss implementation approach
- Submit PR with documentation

### 📖 Documentation
- Improve README clarity
- Add usage examples
- Create video tutorials
- Write blog posts

---

## Guidelines

### Mental Health Sensitivity

This application supports vulnerable individuals. All contributions must:

1. **Use non-judgmental language**
   - ❌ "Just think positive"
   - ✅ "It's okay to not be okay"

2. **Avoid stigmatizing terms**
   - ❌ "Crazy," "insane," "psycho"
   - ✅ "Experiencing mental health challenges"

3. **Never provide medical advice**
   - Always direct users to qualified professionals
   - Include appropriate disclaimers

4. **Prioritize crisis resources**
   - Crisis hotlines must be prominently displayed
   - No paywalls or barriers to emergency help

5. **Respect privacy**
   - No data collection without explicit consent
   - Maintain client-side-only architecture

---

## Development Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code, Sublime, Atom)
- Basic knowledge of HTML, CSS, JavaScript
- Git for version control

### Local Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/mindcare-app.git
cd mindcare-app

# 3. Create a branch for your changes
git checkout -b feature/your-feature-name

# 4. Open index.html in your browser
# OR use a local server:

# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

### Testing Your Changes

1. **Browser Testing**
   - Test in Chrome, Firefox, Safari, Edge
   - Test on mobile devices
   - Test keyboard navigation
   - Test screen reader compatibility

2. **Accessibility Testing**
   - Run Lighthouse audit (Accessibility score should be 95+)
   - Test with keyboard only (no mouse)
   - Test with screen reader (NVDA, JAWS, VoiceOver)
   - Check color contrast ratios

3. **Performance Testing**
   - Lighthouse Performance score should be 95+
   - Check file size (should stay under 100KB)
   - Test load time on slow connections

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Accessibility tested
- [ ] Browser compatibility verified
- [ ] Privacy-preserving (no data collection)

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Content update
- [ ] Documentation
- [ ] Accessibility improvement
- [ ] Performance optimization

## Testing Done
- Browsers tested:
- Accessibility tools used:
- Screenshots (if UI change):

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Accessibility verified
- [ ] No console errors
- [ ] Privacy maintained
```

### Review Process

1. Maintainers will review within 7 days
2. Address feedback and requested changes
3. Once approved, PR will be merged
4. Changes will be included in next release

---

## Style Guidelines

### HTML
```html
<!-- Use semantic HTML5 elements -->
<header>
<nav>
<main>
<section>
<article>
<footer>

<!-- Include ARIA labels for accessibility -->
<button aria-label="Start breathing exercise">
```

### CSS
```css
/* Use CSS custom properties for colors */
:root {
  --primary: #6B9BD1;
  --secondary: #A8D5BA;
}

/* Follow BEM naming convention (optional) */
.card { }
.card__title { }
.card--highlighted { }

/* Prefer rem/em over px for accessibility */
font-size: 1rem;
padding: 1.5rem;
```

### JavaScript
```javascript
// Use ES6+ features
const data = { };
let variable = '';

// Use descriptive variable names
const userMood = 'happy';
const moduleId = 5;

// Comment complex logic
// Calculate streak based on consecutive check-ins
function calculateStreak() {
  // ...
}

// Use template literals
const message = `Welcome back, ${userName}!`;
```

---

## Content Guidelines

### Writing Style

**Tone:**
- Warm, empathetic, supportive
- Non-judgmental and validating
- Clear and concise (no jargon)
- Action-oriented when appropriate

**Reading Level:**
- Target: 8th-grade reading level
- Use short sentences (15-20 words)
- Break content into small chunks
- Use bullet points for scannability

**Structure:**
- Start with key takeaway
- Use headings and subheadings
- Include examples
- End with actionable steps

### Evidence-Based Content

All mental health content must:

1. **Cite reputable sources:**
   - National Institute of Mental Health (NIMH)
   - American Psychological Association (APA)
   - National Alliance on Mental Illness (NAMI)
   - Peer-reviewed journals

2. **Be reviewed by professionals:**
   - Licensed therapist, psychologist, or psychiatrist
   - Include reviewer credentials in PR

3. **Include appropriate disclaimers:**
   - Not a substitute for professional help
   - Encourage seeking qualified care

### Example Module Template

```html
<h3>Module Title</h3>
<p>Brief introduction explaining what users will learn.</p>

<h4>Key Concept 1</h4>
<ul>
  <li>Point with explanation</li>
  <li>Point with explanation</li>
</ul>

<h4>Key Concept 2</h4>
<p>Explanation with example.</p>

<h4>Action Steps</h4>
<p>What users can do today:</p>
<ul>
  <li>Specific, actionable step</li>
  <li>Specific, actionable step</li>
</ul>

<p><strong>Sources:</strong> [Citation in APA format]</p>
```

---

## Bug Reports

### Before Reporting

1. Check existing issues
2. Try reproducing in incognito/private mode
3. Test in different browser
4. Clear browser cache

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of what's wrong

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop, iPhone 13]

**Additional Context**
Any other relevant information
```

---

## Feature Requests

### Before Requesting

1. Check existing feature requests
2. Consider if it aligns with app's purpose
3. Think about privacy implications
4. Consider accessibility impact

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Detailed description of desired functionality

**Describe alternatives you've considered**
Other solutions you've thought about

**Privacy Considerations**
How does this maintain user privacy?

**Accessibility Considerations**
How will this be accessible to all users?

**Additional context**
Mockups, examples, or related links
```

---

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README
- Changelog

---

## Questions?

- **GitHub Discussions:** Ask questions, share ideas
- **GitHub Issues:** Technical issues or feature requests
- **Email:** contribute@mindcareapp.com (simulated)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make mental health support more accessible! 💙
