/* @ds-bundle: {"format":4,"namespace":"DesignSystem_6952b0","components":[{"name":"Accordion","sourcePath":"components/core/Accordion.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Headline","sourcePath":"components/core/Headline.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"UnitCard","sourcePath":"components/core/UnitCard.jsx"}],"sourceHashes":{"components/core/Accordion.jsx":"b1b9688b83bf","components/core/Badge.jsx":"a8c8bd2c5180","components/core/Button.jsx":"32ef675ce9a5","components/core/Card.jsx":"b7d316bfe5b6","components/core/Eyebrow.jsx":"51f266142602","components/core/Headline.jsx":"c465f90c84b8","components/core/Stat.jsx":"565ab793b926","components/core/UnitCard.jsx":"76c428804d3f","presentation/brandbook.js":"9db02c789049"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_6952b0 = window.DesignSystem_6952b0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Accordion.jsx
try { (() => {
/**
 * BEST GYM! accordion (FAQ / info). Accessible expand-collapse with a red
 * active indicator and smooth height transition. Respects reduced motion.
 */
function Accordion({
  items = [],
  allowMultiple = false,
  style = {}
}) {
  const [open, setOpen] = React.useState(() => new Set());
  const toggle = i => {
    setOpen(prev => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);else next.add(i);
      return next;
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      ...style
    }
  }, items.map((it, i) => {
    const isOpen = open.has(i);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        borderBottom: '1px solid var(--line)'
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => toggle(i),
      "aria-expanded": isOpen,
      style: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        textAlign: 'left',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        padding: '22px 4px',
        fontFamily: 'var(--font-text)',
        fontWeight: 600,
        fontSize: '17px',
        color: isOpen ? 'var(--best-red)' : 'var(--ink)',
        transition: 'color var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement("span", null, it.q), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: '0 0 auto',
        width: '26px',
        height: '26px',
        position: 'relative',
        transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
        transition: 'transform var(--dur-base) var(--ease-out)',
        color: isOpen ? 'var(--best-red)' : 'var(--slate)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: '12px',
        left: '4px',
        right: '4px',
        height: '2px',
        background: 'currentColor'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: '12px',
        top: '4px',
        bottom: '4px',
        width: '2px',
        background: 'currentColor'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 4px 24px',
        fontFamily: 'var(--font-text)',
        fontSize: '15px',
        lineHeight: 1.65,
        color: 'var(--text-muted)',
        maxWidth: '60ch'
      }
    }, it.a))));
  }));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! badge / seal (v2 — editorial). Compact uppercase label for
 * campaign flags, availability, "24H", "NOVO", "OFERTA". Cleaner than v1:
 * subtle skew, soft radius, works on light and dark.
 */
function Badge({
  children,
  variant = 'solid',
  // 'solid' | 'soft' | 'outline' | 'ink' | 'live'
  skew = false,
  size = 'md',
  // 'sm' | 'md' | 'lg'
  dot = false,
  // leading status dot
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '4px 10px',
      fontSize: '11px'
    },
    md: {
      padding: '6px 13px',
      fontSize: '12px'
    },
    lg: {
      padding: '9px 18px',
      fontSize: '15px'
    }
  };
  const variants = {
    solid: {
      background: 'var(--best-red)',
      color: 'var(--white)',
      border: '1.5px solid var(--best-red)'
    },
    soft: {
      background: 'var(--red-wash)',
      color: 'var(--red-strong)',
      border: '1.5px solid var(--red-line)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--best-red)',
      border: '1.5px solid var(--best-red)'
    },
    ink: {
      background: 'var(--ink)',
      color: 'var(--white)',
      border: '1.5px solid var(--ink)'
    },
    live: {
      background: 'rgba(255,255,255,0.12)',
      color: 'var(--white)',
      border: '1px solid rgba(255,255,255,0.28)'
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      lineHeight: 1,
      borderRadius: 'var(--radius-pill)',
      transform: skew ? 'skew(-3deg)' : 'none',
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '7px',
      height: '7px',
      borderRadius: '50%',
      background: variant === 'solid' || variant === 'ink' ? 'var(--white)' : 'var(--best-red)',
      display: 'inline-block'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      transform: skew ? 'skew(3deg)' : 'none'
    }
  }, children));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! CTA button (v2 — light-first, premium).
 * Editorial athletic button: Poppins semibold, tight tracking, soft radius,
 * red conversion glow on the primary variant.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'dark' | 'outline' | 'ghost' | 'on-dark'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  block = false,
  iconLeft = null,
  iconRight = null,
  loading = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const isDisabled = disabled || loading;
  const sizes = {
    sm: {
      padding: '10px 18px',
      fontSize: '13px',
      minHeight: '40px'
    },
    md: {
      padding: '14px 26px',
      fontSize: '15px',
      minHeight: '48px'
    },
    lg: {
      padding: '18px 36px',
      fontSize: '17px',
      minHeight: '56px'
    }
  };
  const variants = {
    primary: {
      base: {
        background: 'var(--best-red)',
        color: 'var(--white)',
        border: '1.5px solid var(--best-red)',
        boxShadow: 'var(--glow-cta)'
      },
      hover: {
        background: 'var(--red-strong)',
        border: '1.5px solid var(--red-strong)',
        boxShadow: 'var(--glow-cta-hover)'
      }
    },
    dark: {
      base: {
        background: 'var(--ink)',
        color: 'var(--white)',
        border: '1.5px solid var(--ink)',
        boxShadow: 'var(--shadow-sm)'
      },
      hover: {
        background: '#000',
        boxShadow: 'var(--shadow-md)'
      }
    },
    outline: {
      base: {
        background: 'transparent',
        color: 'var(--ink)',
        border: '1.5px solid var(--ink)',
        boxShadow: 'none'
      },
      hover: {
        background: 'var(--ink)',
        color: 'var(--white)'
      }
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--best-red)',
        border: '1.5px solid transparent',
        boxShadow: 'none'
      },
      hover: {
        background: 'var(--red-wash)'
      }
    },
    'on-dark': {
      base: {
        background: 'var(--white)',
        color: 'var(--ink)',
        border: '1.5px solid var(--white)',
        boxShadow: 'none'
      },
      hover: {
        background: 'rgba(255,255,255,0.86)'
      }
    }
  };
  const v = variants[variant] || variants.primary;
  const merged = {
    ...v.base,
    ...(hover && !isDisabled ? v.hover : null)
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: isDisabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-button)',
      lineHeight: 1,
      borderRadius: 'var(--radius-md)',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transform: active && !isDisabled ? 'translateY(1px)' : 'translateY(0)',
      transition: 'background var(--dur-fast) var(--ease-standard), color var(--dur-fast), box-shadow var(--dur-fast), transform var(--dur-fast)',
      outline: 'none',
      ...sizes[size],
      ...merged,
      ...(isDisabled ? {
        background: 'var(--disabled-surface)',
        color: 'var(--disabled-text)',
        border: '1.5px solid var(--line)',
        boxShadow: 'none',
        opacity: 1
      } : null),
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.boxShadow = 'var(--glow-red-soft)';
    },
    onBlur: e => {
      e.currentTarget.style.boxShadow = merged.boxShadow || 'none';
    }
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      animation: 'bg-spin 0.7s linear infinite'
    }
  }), !loading && iconLeft, !loading && children, !loading && iconRight, /*#__PURE__*/React.createElement("style", null, '@keyframes bg-spin{to{transform:rotate(360deg)}}'));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! surface card (v2 — light-first, editorial).
 * Clean white/paper panel with soft shadow. Variants shift for impact
 * sections (ink) and conversion (red).
 */
function Card({
  children,
  variant = 'solid',
  // 'solid' | 'raised' | 'outline' | 'ink' | 'red'
  accentEdge = false,
  // top red rule (editorial accent)
  interactive = false,
  // hover lift
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    solid: {
      background: 'var(--bg-raised)',
      border: '1px solid var(--line)',
      color: 'var(--text-body)',
      boxShadow: 'var(--shadow-sm)'
    },
    raised: {
      background: 'var(--white)',
      border: '1px solid var(--line)',
      color: 'var(--text-body)',
      boxShadow: 'var(--shadow-md)'
    },
    outline: {
      background: 'transparent',
      border: '1.5px solid var(--line-strong)',
      color: 'var(--text-body)',
      boxShadow: 'none'
    },
    ink: {
      background: 'var(--grad-ink)',
      border: '1px solid rgba(255,255,255,0.10)',
      color: 'var(--text-on-dark)',
      boxShadow: 'var(--shadow-lg)'
    },
    red: {
      background: 'var(--grad-red)',
      border: 'none',
      color: 'var(--text-on-brand)',
      boxShadow: 'var(--glow-cta)'
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      overflow: 'hidden',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base)',
      transform: interactive && hover ? 'translateY(-4px)' : 'translateY(0)',
      ...variants[variant],
      ...(interactive && hover ? {
        boxShadow: 'var(--shadow-lg)'
      } : null),
      ...style
    }
  }, rest), accentEdge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '4px',
      background: 'var(--best-red)'
    }
  }), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! eyebrow / kicker (v2). Uppercase Poppins, wide tracking,
 * leading red rule. Sits above headlines and section titles.
 */
function Eyebrow({
  children,
  tone = 'red',
  // 'red' | 'dark' | 'light' | 'muted'
  tick = true,
  number = null,
  // optional section number, e.g. "03"
  style = {},
  ...rest
}) {
  const tones = {
    red: 'var(--best-red)',
    dark: 'var(--ink)',
    light: 'var(--white)',
    muted: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      fontSize: 'var(--fs-eyebrow)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--ls-eyebrow)',
      color: tones[tone],
      ...style
    }
  }, rest), number && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '1.35em',
      lineHeight: 1,
      color: 'var(--best-red)'
    }
  }, number), tick && !number && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '26px',
      height: '2.5px',
      background: 'var(--best-red)',
      display: 'inline-block'
    }
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Headline.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! impact headline (v2 — editorial athletic).
 * Staatliches condensed caps. Defaults to ink on light; use tone="light"
 * over photography / dark sections. Action word highlighted red.
 */
function Headline({
  children,
  highlight,
  // substring to color red
  size = 'h1',
  // 'display-xl' | 'display-lg' | 'h1' | 'h2' | 'h3'
  tone = 'dark',
  // 'dark' (ink on light) | 'light' (white on dark) | 'red'
  align = 'left',
  as = 'h2',
  style = {},
  ...rest
}) {
  const sizes = {
    'display-xl': 'var(--fs-display-xl)',
    'display-lg': 'var(--fs-display-lg)',
    h1: 'var(--fs-h1)',
    h2: 'var(--fs-h2)',
    h3: 'var(--fs-h3)'
  };
  const tones = {
    dark: 'var(--text-strong)',
    light: 'var(--text-on-dark)',
    red: 'var(--best-red)'
  };
  let content = children;
  if (highlight && typeof children === 'string' && children.includes(highlight)) {
    const parts = children.split(highlight);
    content = /*#__PURE__*/React.createElement(React.Fragment, null, parts[0], /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--best-red)'
      }
    }, highlight), parts.slice(1).join(highlight));
  }
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: sizes[size],
      lineHeight: size.startsWith('display') ? 'var(--lh-display)' : 'var(--lh-tight)',
      letterSpacing: 'var(--ls-display)',
      textTransform: 'uppercase',
      textAlign: align,
      textWrap: 'balance',
      color: tones[tone],
      ...style
    }
  }, rest), content);
}
Object.assign(__ds_scope, { Headline });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Headline.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! stat block (v2). Big Staatliches number + Poppins label.
 * "24H", "+1200", "2 UNIDADES", "365 DIAS".
 */
function Stat({
  value,
  label,
  tone = 'dark',
  // 'dark' | 'light' | 'red'
  align = 'left',
  size = 'md',
  // 'sm' | 'md' | 'lg'
  style = {},
  ...rest
}) {
  const numColor = tone === 'red' ? 'var(--best-red)' : tone === 'light' ? 'var(--white)' : 'var(--ink)';
  const labelColor = tone === 'light' ? 'var(--text-on-dark-muted)' : 'var(--text-muted)';
  const numSize = {
    sm: 'var(--fs-h1)',
    md: 'var(--fs-stat)',
    lg: 'var(--fs-display-lg)'
  }[size];
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: numSize,
      lineHeight: 0.88,
      textTransform: 'uppercase',
      color: numColor,
      letterSpacing: '0.005em'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '10px',
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      fontSize: 'var(--fs-caption)',
      letterSpacing: 'var(--ls-eyebrow)',
      textTransform: 'uppercase',
      color: labelColor
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/core/UnitCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * BEST GYM! unit card. Scalable location card for the unit system:
 * photo, city, address, 24h badge, quick facts, CTA. Built to scale
 * across Valongo, Vila Nova de Famalicão and future locations.
 */
function UnitCard({
  city,
  address,
  image,
  hours = '24H · 7 DIAS · 365',
  areas = [],
  ctaLabel = 'Ver unidade',
  onCta,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--white)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: '16 / 10',
      overflow: 'hidden',
      background: 'var(--mist)'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: 'Best Gym ' + city,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      transform: hover ? 'scale(var(--img-hover-scale))' : 'scale(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '14px',
      left: '14px',
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      fontSize: '11px',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      background: 'var(--best-red)',
      color: 'var(--white)',
      padding: '6px 12px',
      borderRadius: 'var(--radius-pill)'
    }
  }, hours)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '30px',
      lineHeight: 1,
      textTransform: 'uppercase',
      color: 'var(--ink)'
    }
  }, city), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '8px',
      fontFamily: 'var(--font-text)',
      fontSize: '14px',
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, address)), areas.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    }
  }, areas.map((a, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      fontFamily: 'var(--font-text)',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--text-body)',
      background: 'var(--mist)',
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)'
    }
  }, a))), /*#__PURE__*/React.createElement("button", {
    onClick: onCta,
    style: {
      marginTop: 'auto',
      alignSelf: 'flex-start',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: 'var(--font-text)',
      fontWeight: 600,
      fontSize: '14px',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--best-red)',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 0'
    }
  }, ctaLabel, /*#__PURE__*/React.createElement("span", {
    style: {
      transform: hover ? 'translateX(4px)' : 'translateX(0)',
      transition: 'transform var(--dur-fast)'
    }
  }, "\u2192"))));
}
Object.assign(__ds_scope, { UnitCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/UnitCard.jsx", error: String((e && e.message) || e) }); }

// presentation/brandbook.js
try { (() => {
/* BEST GYM! — Brand book interactions */
(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.section'));

  /* ---------- section nav ---------- */
  var nav = document.getElementById('railNav');
  sections.forEach(function (s) {
    var b = document.createElement('button');
    b.className = 'rail-link';
    b.dataset.target = s.id;
    b.innerHTML = '<span class="no">' + s.dataset.no + '</span><span>' + s.dataset.title + '</span>';
    b.addEventListener('click', function () {
      var top = s.getBoundingClientRect().top + window.pageYOffset - 4;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
      document.getElementById('rail').classList.remove('open');
    });
    nav.appendChild(b);
  });
  var links = Array.prototype.slice.call(nav.querySelectorAll('.rail-link'));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) {
          l.classList.toggle('active', l.dataset.target === e.target.id);
        });
      }
    });
  }, {
    rootMargin: '-45% 0px -50% 0px'
  });
  sections.forEach(function (s) {
    io.observe(s);
  });

  /* ---------- reveal on scroll ---------- */
  var revs = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var rio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        rio.unobserve(e.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px'
  });
  revs.forEach(function (r) {
    rio.observe(r);
  });

  /* ---------- mobile nav toggle ---------- */
  var menuBtn = document.getElementById('menuBtn');
  function checkMobile() {
    menuBtn.style.display = window.innerWidth <= 1020 ? 'inline-flex' : 'none';
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);
  menuBtn.addEventListener('click', function () {
    document.getElementById('rail').classList.toggle('open');
  });

  /* ---------- logo version selector ---------- */
  var logoMap = {
    red: {
      src: '../assets/logo-red.png',
      bg: 'var(--off-white)'
    },
    white: {
      src: '../assets/logo-white.png',
      bg: 'var(--ink)'
    },
    black: {
      src: '../assets/logo-black.png',
      bg: 'var(--mist)'
    },
    onred: {
      src: '../assets/logo-white.png',
      bg: 'var(--best-red)'
    }
  };
  bindChips('logoChips', 'logo', function (v) {
    var m = logoMap[v];
    document.getElementById('logoImg').src = m.src;
    document.getElementById('logoStage').style.background = m.bg;
  });

  /* ---------- component state selector ---------- */
  bindChips('stateChips', 'state', function (v) {
    var btn = document.getElementById('demoBtn');
    btn.className = 'btn primary';
    btn.disabled = false;
    btn.textContent = 'Inscreve-te agora';
    if (v === 'hover') {
      btn.style.background = 'var(--red-strong)';
      btn.style.boxShadow = 'var(--glow-cta-hover)';
    } else {
      btn.style.background = '';
      btn.style.boxShadow = '';
    }
    if (v === 'disabled') {
      btn.className = 'btn disabled';
      btn.disabled = true;
      btn.textContent = 'Indisponível';
    }
    if (v === 'loading') {
      btn.textContent = 'A enviar…';
      btn.style.opacity = '.85';
    } else {
      btn.style.opacity = '';
    }
  });

  /* ---------- campaign selector ---------- */
  var camps = {
    verao: {
      eye: 'Campanha de verão',
      title: 'Olá verão,<br/>olá descontos.',
      desc: 'Não fiques de fora. 3 meses de oferta + inscrição grátis.',
      img: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
      bg: 'var(--best-red)',
      fg: '#fff'
    },
    novo: {
      eye: 'Ano novo',
      title: 'Novo ano.<br/>Novo tu.',
      desc: 'A tua meta começa hoje. Entra no modo Best.',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
      bg: 'var(--ink)',
      fg: '#fff'
    },
    builtby: {
      eye: 'Built by Best',
      title: 'Treino com<br/>direção.',
      desc: 'Avaliação, planeamento, execução e acompanhamento com método.',
      img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
      bg: '#fff',
      fg: 'var(--ink)'
    }
  };
  bindChips('campChips', 'camp', function (v) {
    var c = camps[v],
      block = document.getElementById('campBlock');
    block.style.background = c.bg;
    block.style.color = c.fg;
    document.getElementById('campEye').textContent = c.eye;
    document.getElementById('campEye').className = 'eyebrow no-tick' + (c.fg === '#fff' ? ' light' : '');
    document.getElementById('campTitle').innerHTML = c.title;
    document.getElementById('campTitle').style.color = c.fg;
    document.getElementById('campDesc').textContent = c.desc;
    document.getElementById('campImg').src = c.img;
  });

  /* ---------- unit selector ---------- */
  var units = {
    valongo: {
      city: 'Best Gym Valongo',
      addr: 'Avenida 25 de Abril, 381<br/>4440-502 Valongo',
      contact: 'valongo@bestgym.pt · +351 926 447 998',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80',
      areas: ['Musculação', 'Cardio', 'Cross Training', 'Burn Zone']
    },
    famalicao: {
      city: 'Best Gym Famalicão',
      addr: 'Av. Centenário da República, D68, Calendário<br/>4760-859 Vila Nova de Famalicão',
      contact: 'famalicao@bestgym.pt · +351 925 908 404',
      img: 'https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?w=900&q=80',
      areas: ['Musculação', 'Posing Room', 'Classes', 'Personal Training']
    },
    future: {
      city: 'Próxima unidade',
      addr: 'Cidade a anunciar<br/>Rede em crescimento nacional',
      contact: 'geral@bestgym.pt',
      img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80',
      areas: ['24 Horas', 'Performance', 'Comunidade']
    }
  };
  bindChips('unitChips', 'unit', function (v) {
    var u = units[v];
    document.getElementById('unitCity').textContent = u.city;
    document.getElementById('unitAddr').innerHTML = u.addr;
    document.getElementById('unitContact').textContent = u.contact;
    document.getElementById('unitImg').src = u.img;
    document.getElementById('unitAreas').innerHTML = u.areas.map(function (a) {
      return '<span class="tagchip">' + a + '</span>';
    }).join('');
  });
  document.getElementById('unitAreas').innerHTML = units.valongo.areas.map(function (a) {
    return '<span class="tagchip">' + a + '</span>';
  }).join('');

  /* ---------- device preview ---------- */
  bindChips('deviceChips', 'w', function (v) {
    document.getElementById('device').style.width = v === '100%' ? '100%' : v;
    document.getElementById('device').style.maxWidth = v === '100%' ? '1040px' : v;
  });

  /* ---------- icons (single linear style) ---------- */
  var icons = [['24 Horas', 'M12 6v6l4 2'], ['Musculação', 'M4 12h16 M7 8v8 M17 8v8 M4 9v6 M20 9v6'], ['Cardio', 'M20.8 8.6a5 5 0 0 0-8.8-2 5 5 0 0 0-8.8 2c0 4 8.8 10 8.8 10s8.8-6 8.8-10z'], ['Cross', 'M6 6l12 12 M18 6L6 18'], ['Localização', 'M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z'], ['Classes', 'M4 6h16 M4 12h16 M4 18h10'], ['Personal', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4 20c0-4 4-6 8-6s8 2 8 6'], ['Comunidade', 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M17 11a3 3 0 1 0 0-6 M3 20c0-3 3-5 6-5s6 2 6 5 M15 20c0-2 1-3.5 3-4']];
  var ig = document.getElementById('iconGrid');
  icons.forEach(function (ic) {
    var paths = ic[1].split(' M').map(function (p, i) {
      return '<path d="' + (i ? 'M' + p : p) + '"/>';
    }).join('');
    var d = document.createElement('div');
    d.className = 'card';
    d.style.textAlign = 'center';
    d.innerHTML = '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--best-red)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto 12px;">' + paths + '</svg><div style="font-size:13px;font-weight:600;color:var(--ink);letter-spacing:.02em;">' + ic[0] + '</div>';
    ig.appendChild(d);
  });

  /* ---------- social feed (9 varied tiles) ---------- */
  var feed = [{
    m: 'red',
    t: 'Olá verão,<br/>olá descontos.',
    k: 'Campanha'
  }, {
    m: 'photo',
    img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&q=80',
    t: 'Treino feito.<br/>Dia ganho.',
    k: 'Motivação'
  }, {
    m: 'light',
    t: '24H · 7 dias<br/>365 dias.',
    k: 'Sempre aberto'
  }, {
    m: 'ink',
    t: 'Não vendemos<br/>musculação.',
    k: 'Posicionamento'
  }, {
    m: 'photo',
    img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&q=80',
    t: 'Built by<br/>Best.',
    k: 'Programa'
  }, {
    m: 'light',
    t: 'Duas unidades.<br/>Uma rede.',
    k: 'Unidades'
  }, {
    m: 'red',
    t: 'Inscrição<br/>grátis.',
    k: 'Oferta'
  }, {
    m: 'photo',
    img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=500&q=80',
    t: 'Entra no<br/>modo Best.',
    k: 'Comunidade'
  }, {
    m: 'ink',
    t: 'Performance<br/>todos os dias.',
    k: 'Assinatura'
  }];
  var fg = document.getElementById('feedGrid');
  feed.forEach(function (p) {
    var bg = p.m === 'red' ? 'var(--best-red)' : p.m === 'ink' ? 'var(--ink)' : p.m === 'light' ? 'var(--white)' : 'var(--ink)';
    var fgc = p.m === 'light' ? 'var(--ink)' : '#fff';
    var kcol = p.m === 'light' ? 'var(--best-red)' : p.m === 'red' ? 'rgba(255,255,255,.85)' : 'var(--best-red)';
    var inner = '<div style="position:relative;z-index:2;display:flex;flex-direction:column;height:100%;justify-content:space-between;padding:24px;">' + '<span style="font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:' + kcol + ';">' + p.k + '</span>' + '<div class="display" style="font-size:30px;color:' + fgc + ';line-height:.95;">' + p.t + '</div>' + '<img src="../assets/' + (p.m === 'light' ? 'logo-red' : 'logo-white') + '.png" style="width:70px;"/></div>';
    var media = p.m === 'photo' ? '<img src="' + p.img + '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;"/><div style="position:absolute;inset:0;background:var(--overlay-read);z-index:1;"></div>' : '';
    var d = document.createElement('div');
    d.style.cssText = 'position:relative;aspect-ratio:4/5;border-radius:var(--radius-md);overflow:hidden;background:' + bg + ';border:1px solid var(--line);';
    d.innerHTML = media + inner;
    fg.appendChild(d);
  });

  /* ---------- counters ---------- */
  var c1 = document.getElementById('counter1'),
    counted = false;
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && !counted) {
        counted = true;
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
          c1.textContent = '365';
          return;
        }
        var n = 0;
        var iv = setInterval(function () {
          n += 9;
          if (n >= 365) {
            n = 365;
            clearInterval(iv);
          }
          c1.textContent = n;
        }, 16);
      }
    });
  }, {
    threshold: .5
  });
  cio.observe(c1);

  /* ---------- motion replay ---------- */
  document.getElementById('motionBtn').addEventListener('click', function () {
    var s14 = document.getElementById('s14');
    s14.querySelectorAll('.reveal').forEach(function (r) {
      r.classList.remove('in');
      void r.offsetWidth;
      setTimeout(function () {
        r.classList.add('in');
      }, 40);
    });
    var top = s14.getBoundingClientRect().top + window.pageYOffset - 4;
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
  });

  /* ---------- PDF export ---------- */
  document.getElementById('pdfBtn').addEventListener('click', function () {
    document.querySelectorAll('.reveal').forEach(function (r) {
      r.classList.add('in');
    });
    window.print();
  });
  function bindChips(id, key, fn) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    var chips = Array.prototype.slice.call(wrap.querySelectorAll('.chip'));
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        chips.forEach(function (x) {
          x.classList.remove('active', 'red');
        });
        c.classList.add('active');
        if (wrap.querySelector('[data-' + key + '].active') && (id === 'logoChips' || id === 'campChips' || id === 'unitChips')) c.classList.add('red');
        fn(c.dataset[key]);
      });
    });
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "presentation/brandbook.js", error: String((e && e.message) || e) }); }

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Headline = __ds_scope.Headline;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.UnitCard = __ds_scope.UnitCard;

})();
