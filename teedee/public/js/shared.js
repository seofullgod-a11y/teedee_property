// shared.js — helpers + Tabler inline SVG icons + card renderer
const TD = {
  icons: {
    home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/></svg>',
    building: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0"/><path d="M9 8l1 0"/><path d="M9 12l1 0"/><path d="M9 16l1 0"/><path d="M14 8l1 0"/><path d="M14 12l1 0"/><path d="M14 16l1 0"/><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16"/></svg>',
    townhouse: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21v-13l9 -4l9 4v13"/><path d="M13 13h4v8h-10v-6h6"/><path d="M13 21v-9a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v3"/></svg>',
    land: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18.5l-3 -1.5l-6 3v-13l6 -3l6 3l6 -3v7.5"/><path d="M9 4v13"/><path d="M15 7v5.5"/><path d="M21.121 20.121a3 3 0 1 0 -4.242 0c.418 .419 1.125 1.045 2.121 1.879c1.051 -.89 1.759 -1.516 2.121 -1.879z"/><path d="M19 18v.01"/></svg>',
    store: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l18 0"/><path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4"/><path d="M5 21l0 -10.15"/><path d="M19 21l0 -10.15"/><path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4"/></svg>',
    search: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/></svg>',
    pin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>',
    bed: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v11m0 -4h18m0 4v-8a2 2 0 0 0 -2 -2h-8v6"/><path d="M7 10m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"/></svg>',
    bath: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4v-3a1 1 0 0 1 1 -1z"/><path d="M6 12v-7a2 2 0 0 1 2 -2h3v2.25"/><path d="M4 21l1 -1.5"/><path d="M20 21l-1 -1.5"/></svg>',
    ruler: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-7a1 1 0 0 0 -1 1v7a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1"/><path d="M4 8l2 0"/><path d="M4 12l3 0"/><path d="M4 16l2 0"/><path d="M8 4l0 2"/><path d="M12 4l0 3"/><path d="M16 4l0 2"/></svg>',
    stairs: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4v-4h4v-4h4v-4h4"/></svg>',
    paw: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 13.5c-1.1 -2 -1.441 -2.5 -2.7 -2.5c-1.259 0 -1.736 .755 -2.836 2.747c-.942 1.703 -2.846 1.845 -3.321 3.291c-.097 .265 -.145 .677 -.143 .962c0 1.176 .787 2 1.8 2c1.259 0 3 -1 4.5 -1s3.241 1 4.5 1c1.013 0 1.8 -.823 1.8 -2c0 -.285 -.049 -.697 -.146 -.962c-.475 -1.451 -2.512 -1.587 -3.454 -3.538z"/><path d="M20.188 8.082a1.039 1.039 0 0 0 -.406 -.082h-.015c-.735 .012 -1.56 .75 -1.993 1.866c-.519 1.335 -.28 2.7 .538 3.052c.129 .055 .267 .082 .406 .082c.739 0 1.575 -.742 2.011 -1.866c.516 -1.335 .273 -2.7 -.54 -3.052z"/><path d="M9.474 9c.055 0 .109 0 .163 -.011c.944 -.128 1.533 -1.346 1.32 -2.722c-.203 -1.297 -1.047 -2.267 -1.932 -2.267c-.055 0 -.109 0 -.163 .011c-.944 .128 -1.533 1.346 -1.32 2.722c.204 1.293 1.048 2.267 1.933 2.267z"/><path d="M16.456 6.733c.214 -1.376 -.375 -2.594 -1.32 -2.722a1.164 1.164 0 0 0 -.162 -.011c-.885 0 -1.728 .97 -1.93 2.267c-.214 1.376 .375 2.594 1.32 2.722c.054 .007 .108 .011 .162 .011c.885 0 1.73 -.974 1.93 -2.267z"/><path d="M5.69 12.918c.816 -.352 1.054 -1.719 .536 -3.052c-.436 -1.124 -1.271 -1.866 -2.009 -1.866c-.14 0 -.277 .027 -.407 .082c-.816 .352 -1.054 1.719 -.536 3.052c.436 1.124 1.271 1.866 2.009 1.866c.14 0 .277 -.027 .407 -.082z"/></svg>',
    check: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"/></svg>',
    shield: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06"/><path d="M15 19l2 2l4 -4"/></svg>',
    sparkles: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l14 0"/><path d="M13 18l6 -6"/><path d="M13 6l6 6"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"/></svg>',
    coin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"/><path d="M12 7v10"/></svg>',
    fileCheck: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/><path d="M9 15l2 2l4 -4"/></svg>',
    headset: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14v-3a8 8 0 1 1 16 0v3"/><path d="M18 19c0 1.657 -2.686 3 -6 3"/><path d="M4 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z"/><path d="M15 14a2 2 0 0 1 2 -2h1a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2 -2v-3z"/></svg>',
    mapSearch: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 18l-2 -1l-6 3v-13l6 -3l6 3l6 -3v7.5"/><path d="M9 4v13"/><path d="M15 7v5"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M20.2 20.2l1.8 1.8"/></svg>',
    ban: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M5.7 5.7l12.6 12.6"/></svg>',
    heart: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/></svg>',
    share: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/></svg>',
    copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/></svg>',
    key: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z"/><path d="M15 9h.01"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"/><path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/></svg>',
    calc: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M8 7m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z"/><path d="M8 14l0 .01"/><path d="M12 14l0 .01"/><path d="M16 14l0 .01"/><path d="M8 17l0 .01"/><path d="M12 17l0 .01"/><path d="M16 17l0 .01"/></svg>',
    transit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M18 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M4 17h-2v-11a1 1 0 0 1 1 -1h14a5 7 0 0 1 5 7v5h-2m-4 0h-8"/><path d="M16 5l1.5 7l4.5 0"/><path d="M2 10l15 0"/><path d="M7 5l0 5"/><path d="M12 5l0 5"/></svg>',
    health: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v4h4v8h-4v4h-8v-4h-4v-8h4z"/></svg>',
    edu: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"/><path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"/></svg>',
    leisure: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-13"/><path d="M9.824 16a3 3 0 0 1 -2.743 -3.69a3 3 0 0 1 .304 -4.833a3 3 0 0 1 4.615 -3.707a3 3 0 0 1 4.614 3.707a3 3 0 0 1 .305 4.833a3 3 0 0 1 -2.919 3.695h-4z"/></svg>',
    calendar: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M16 3l0 4"/><path d="M8 3l0 4"/><path d="M4 11l16 0"/><path d="M11 15l1 0"/><path d="M12 15l0 3"/></svg>',
    route: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/><path d="M17 17m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"/><path d="M5 17v-4a4 4 0 0 1 4 -4h6a4 4 0 0 0 4 -4"/></svg>',
    sun: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"/></svg>',
    moon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"/></svg>',
    translate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"/><path d="M9 3v2c0 4.418 -2.239 8 -5 8"/><path d="M5 9c0 2.144 2.952 3.908 6.7 4"/><path d="M12 20l4 -9l4 9"/><path d="M19.1 18h-6.2"/></svg>',
    compare: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/><path d="M7 8l-4 4l4 4"/><path d="M17 8l4 4l-4 4"/></svg>',
    bell: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></svg>',
    star: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"/></svg>',
    verified: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.5 1.8h3l1 3l2.5 1.7l-1 3l1 3l-2.5 1.7l-1 3h-3l-2.5 1.8l-2.5 -1.8h-3l-1 -3l-2.5 -1.7l1 -3l-1 -3l2.5 -1.7l1 -3h3z"/><path d="M9 12l2 2l4 -4"/></svg>',
    flag: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5v16"/><path d="M5 5h11l-2 4l2 4h-11"/></svg>',
    user: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0 -4 4 -6 8 -6s8 2 8 6"/></svg>'
  },

  brand: { main: 'อยู่', accent: 'ใจ', sub: 'yoojai.com', logo: '' },
  _active: '',

  brandHtml(dark) {
    const b = this.brand;
    const isDark = document.documentElement.dataset.theme === 'dark';
    const src = (isDark && b.logoDark) ? b.logoDark : b.logo;
    const logo = src
      ? `<img class="logo-img" src="${this.esc(src)}" alt="${this.esc(b.main + b.accent)}">`
      : `<span class="mark">${this.icons.home}</span>`;
    return `<a class="brand" ${dark ? 'style="color:#fff"' : ''} href="/">${logo}${this.esc(b.main)}<em>${this.esc(b.accent)}</em>${b.sub ? `<span class="sub-th">${this.esc(b.sub)}</span>` : ''}</a>`;
  },

  chrome(active) {
    this._active = active || '';
    this.renderChrome();
    this.initBrand();
    this.loadUser();
    this.initPWA();
  },
  initPWA() {
    if (this._pwaInit) return; this._pwaInit = true;
    var head = document.head;
    if (!document.querySelector('link[rel="manifest"]')) {
      var m = document.createElement('link'); m.rel = 'manifest'; m.href = '/manifest.json'; head.appendChild(m);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      var dark = document.documentElement.dataset.theme === 'dark';
      var t = document.createElement('meta'); t.name = 'theme-color'; t.content = dark ? '#14130f' : '#191917'; head.appendChild(t);
    }
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
      var a = document.createElement('link'); a.rel = 'apple-touch-icon'; a.href = '/img/icon-192.png'; head.appendChild(a);
    }
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').catch(function () {});
      });
    }
    // ปุ่มติดตั้งแอป (แสดงเมื่อเบราว์เซอร์รองรับ)
    var self = this;
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); self._installEvt = e;
      if (localStorage.getItem('yj_pwa_dismissed') === '1') return;
      self.showInstallPill();
    });
  },
  showInstallPill() {
    if (document.getElementById('pwaPill')) return;
    var pill = document.createElement('div');
    pill.id = 'pwaPill'; pill.className = 'pwa-pill';
    pill.innerHTML = '<span>📲 ติดตั้งแอปอยู่ใจ ใช้ง่ายเหมือนแอปจริง</span>' +
      '<button class="pwa-install">ติดตั้ง</button><button class="pwa-x" aria-label="ปิด">✕</button>';
    document.body.appendChild(pill);
    var self = this;
    pill.querySelector('.pwa-install').onclick = async function () {
      if (!self._installEvt) { pill.remove(); return; }
      self._installEvt.prompt();
      try { await self._installEvt.userChoice; } catch (e) {}
      self._installEvt = null; pill.remove();
    };
    pill.querySelector('.pwa-x').onclick = function () {
      localStorage.setItem('yj_pwa_dismissed', '1'); pill.remove();
    };
  },
  renderChrome() {
    const nav = document.getElementById('nav');
    const foot = document.getElementById('footer');
    if (nav) nav.innerHTML = this.navbar(this._active);
    if (foot) foot.innerHTML = this.footer();
    this.bottomNav(this._active);
  },
  bottomNav(active) {
    let el = document.getElementById('bottomNav');
    if (!el) {
      el = document.createElement('nav');
      el.id = 'bottomNav';
      el.className = 'bottom-nav';
      el.setAttribute('aria-label', 'เมนูหลัก');
      document.body.appendChild(el);
    }
    const items = [
      { k: 'home', href: '/', ic: 'home', t: 'หน้าแรก' },
      { k: 'rent', href: '/search?type=rent', ic: 'key', t: 'เช่า' },
      { k: 'sale', href: '/search?type=sale', ic: 'coin', t: 'ซื้อ' },
      { k: 'land', href: '/search?category=land', ic: 'land', t: 'ที่ดิน' },
      { k: 'saved', href: '/saved', ic: 'heart', t: 'โปรด' }
    ];
    el.innerHTML = items.map(i =>
      `<a href="${i.href}" class="bn-item ${active === i.k ? 'on' : ''}" ${active === i.k ? 'aria-current="page"' : ''}>${this.icons[i.ic]}<span>${i.t}</span></a>`).join('');
  },
  async initBrand() {
    try {
      const cached = localStorage.getItem('yj_settings');
      if (cached) this.applyBrandData(JSON.parse(cached), true);
      const s = await fetch('/api/settings').then(r => r.json());
      localStorage.setItem('yj_settings', JSON.stringify(s));
      this.applyBrandData(s, true);
    } catch { /* ใช้ค่า default */ }
  },
  applyBrandData(s, rerender) {
    const next = {
      main: s.site_name_main || 'อยู่',
      accent: s.site_name_accent || 'ใจ',
      sub: s.site_subtitle || '',
      logo: s.logo_url || '',
      logoDark: s.logo_url_dark || ''
    };
    if (JSON.stringify(next) === JSON.stringify(this.brand)) return;
    this.brand = next;
    if (rerender) this.renderChrome();
  },

  _labels: {
    cat: {
      th: { house: 'บ้านเดี่ยว', condo: 'คอนโด', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' },
      en: { house: 'House', condo: 'Condo', townhouse: 'Townhouse', land: 'Land', commercial: 'Commercial' }
    },
    type: {
      th: { rent: 'เช่า', sale: 'ขาย' },
      en: { rent: 'Rent', sale: 'Sale' }
    }
  },
  catLabel: { house: 'บ้านเดี่ยว', condo: 'คอนโด', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' },
  catIcon: { house: 'home', condo: 'building', townhouse: 'townhouse', land: 'land', commercial: 'store' },
  typeLabel: { rent: 'เช่า', sale: 'ขาย' },

  favs() {
    try { return JSON.parse(localStorage.getItem('teedee_favs') || '[]'); } catch { return []; }
  },
  compareList() {
    try { return JSON.parse(localStorage.getItem('yj_compare') || '[]'); } catch { return []; }
  },
  promoBadge(l) {
    const map = {
      hot: { cls: 'b-hot', label: '🔥 มาแรง' },
      price_drop: { cls: 'b-drop', label: '↓ ราคาพิเศษ' },
      new_project: { cls: 'b-new', label: 'โครงการใหม่' },
      urgent: { cls: 'b-urgent', label: 'ด่วน!' }
    };
    return (l.badge && map[l.badge]) ? map[l.badge] : null;
  },
  toggleCompare(id) {
    id = Number(id);
    let c = this.compareList();
    if (c.includes(id)) c = c.filter(x => x !== id);
    else { if (c.length >= 3) return { list: c, full: true }; c = [...c, id]; }
    localStorage.setItem('yj_compare', JSON.stringify(c));
    return { list: c, full: false };
  },
  toggleFav(id) {
    id = Number(id);
    let f = this.favs();
    f = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
    localStorage.setItem('teedee_favs', JSON.stringify(f));
    return f.includes(id);
  },
  recent() {
    try { return JSON.parse(localStorage.getItem('teedee_recent') || '[]'); } catch { return []; }
  },
  pushRecent(id) {
    id = Number(id);
    const r = [id, ...this.recent().filter(x => x !== id)].slice(0, 8);
    localStorage.setItem('teedee_recent', JSON.stringify(r));
  },

  // ---------- ระบบเรียนรู้รสนิยม (ในเครื่องผู้ใช้ ไม่ต้องล็อกอิน) ----------
  taste: {
    _read() {
      try { return JSON.parse(localStorage.getItem('yj_taste_v1') || '{}'); } catch { return {}; }
    },
    _write(t) { try { localStorage.setItem('yj_taste_v1', JSON.stringify(t)); } catch (e) {} },
    // บันทึกความสนใจจากทรัพย์ที่ดู/ถูกใจ (weight: ดู=1, กดหัวใจ/ปัดขวา=3)
    bump(l, w) {
      if (!l) return;
      w = w || 1;
      const t = this._read();
      const inc = (key, val) => {
        if (!val) return;
        t[key] = t[key] || {};
        t[key][val] = (t[key][val] || 0) + w;
      };
      inc('cat', l.category); inc('type', l.listing_type); inc('prov', l.province);
      if (Number(l.price) > 0) {
        t.priceSum = (t.priceSum || 0) + Number(l.price) * w;
        t.priceN = (t.priceN || 0) + w;
      }
      t.n = (t.n || 0) + w;
      this._write(t);
    },
    // สรุปรสนิยมเด่น → ใช้ประกอบ query "คัดมาเพื่อคุณ"
    top() {
      const t = this._read();
      if (!t.n || t.n < 2) return null; // ยังรู้จักน้อยไป ไม่เดามั่ว
      const best = (obj) => {
        const e = Object.entries(obj || {}).sort((a, b) => b[1] - a[1])[0];
        return e ? e[0] : '';
      };
      return {
        category: best(t.cat), type: best(t.type), province: best(t.prov),
        avgPrice: t.priceN ? Math.round(t.priceSum / t.priceN) : 0, strength: t.n
      };
    }
  },

  // ---------- 🎭 บ้านนี้เหมาะกับใคร — วิเคราะห์บุคลิกทรัพย์จากข้อมูลจริง ----------
  personaTags(l) {
    if (!l) return [];
    const tags = [];
    const txt = [l.title, l.description, (l.highlights || []).join(' '), (l.amenities || []).join(' '),
      (l.nearby || []).map(n => n.name || n).join(' '), l.location_text].join(' ').toLowerCase();
    const has = (...words) => words.some(w => txt.includes(w));

    if (l.pets_allowed) tags.push({ ic: '🐾', t: 'ทาสหมาแมวอยู่ได้สบาย' });
    if (has('bts', 'mrt', 'รถไฟฟ้า', 'สถานี')) tags.push({ ic: '🚆', t: 'สายเดินทางรถไฟฟ้า' });
    if (Number(l.bedrooms) >= 3) tags.push({ ic: '👨‍👩‍👧‍👦', t: 'ครอบครัวใหญ่อยู่สบาย' });
    if (has('สระ', 'ฟิตเนส', 'gym', 'pool', 'ออกกำลัง', 'วิ่ง')) tags.push({ ic: '💪', t: 'สายสุขภาพ ชอบออกกำลัง' });
    if (has('สวน', 'ต้นไม้', 'ธรรมชาติ', 'เงียบ', 'สงบ', 'ร่มรื่น')) tags.push({ ic: '🌿', t: 'รักความสงบและธรรมชาติ' });
    if (has('มหาวิทยาลัย', 'ม.', 'วิทยาลัย', 'โรงเรียน')) tags.push({ ic: '🎓', t: 'นักศึกษา / ครอบครัวมีลูก' });
    if (has('ตลาด', 'ห้าง', 'เซ็นทรัล', 'โลตัส', 'บิ๊กซี', 'ร้านอาหาร', 'คาเฟ่')) tags.push({ ic: '🛍️', t: 'สายกิน-ช้อป ใกล้ของครบ' });
    if (l.category === 'condo' && Number(l.area_sqm) > 0 && Number(l.area_sqm) <= 35) tags.push({ ic: '💼', t: 'คนเมืองเริ่มต้นชีวิตเอง' });
    if (Number(l.area_sqm) >= 120 || has('โฮมออฟฟิศ', 'home office', 'ทำงานที่บ้าน')) tags.push({ ic: '💻', t: 'สาย Work From Home' });
    if (l.category === 'land') tags.push({ ic: '🏗️', t: 'นักลงทุน / สร้างบ้านในฝัน' });
    if (l.category === 'commercial') tags.push({ ic: '🏪', t: 'ทำธุรกิจ-ค้าขาย' });
    if (has('รีโนเวท', 'ตกแต่งใหม่', 'built-in', 'บิวท์อิน')) tags.push({ ic: '✨', t: 'ชอบของใหม่ พร้อมเข้าอยู่' });
    if (l.listing_type === 'rent' && Number(l.price) > 0 && Number(l.price) <= 8000) tags.push({ ic: '🪙', t: 'งบเบา ๆ ก็อยู่ดีได้' });

    // เรียงตามลำดับที่เจอ เอาไม่เกิน 3 ป้ายเด่นสุด
    return tags.slice(0, 3);
  },

  esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  },

  price(n, type) {
    const num = Number(n) || 0;
    if (type === 'sale' && num >= 1000000) {
      const m = num / 1000000;
      return `฿${m % 1 === 0 ? m : m.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} ล้าน`;
    }
    return `฿${num.toLocaleString('th-TH')}`;
  },

  card(l) {
    const img = (l.images && l.images[0]) || '';
    const specs = [];
    if (l.bedrooms > 0) specs.push({ ic: 'bed', t: `${l.bedrooms} นอน` });
    if (l.bathrooms > 0) specs.push({ ic: 'bath', t: `${l.bathrooms} น้ำ` });
    if (Number(l.area_sqm) > 0) specs.push({ ic: 'ruler', t: `${Number(l.area_sqm)} ตร.ม.` });
    if (Number(l.land_area_sqwah) > 0) specs.push({ ic: 'land', t: `${Number(l.land_area_sqwah)} ตร.ว.` });
    if (l.floor_text) specs.push({ ic: 'stairs', t: `ชั้น ${this.esc(l.floor_text)}` });

    const nearby = (l.nearby || []).slice(0, 2).map(n =>
      `<div class="nb"><span class="pill">ใกล้</span>${this.esc(n.label)} <span style="opacity:.7">(${this.esc(n.dist)})</span></div>`).join('');

    const faved = this.favs().includes(Number(l.id));
    const cmp = this.compareList().includes(Number(l.id));
    const promo = this.promoBadge(l);
    return `
    <a class="card" href="/listing/${l.id}">
      <div class="thumb${promo ? ' has-promo' : ''}">
        ${img ? `<img src="${this.esc(img)}" alt="${this.esc(l.title)}" loading="lazy" decoding="async">` : ''}
        ${promo ? `<span class="promo-badge ${promo.cls}">${promo.label}</span>` : ''}
        <button class="fav-btn ${faved ? 'on' : ''}" data-fav="${l.id}" type="button" aria-label="บันทึกรายการโปรด">${this.icons.heart}</button>
        <button class="cmp-btn ${cmp ? 'on' : ''}" data-cmp="${l.id}" type="button" aria-label="เปรียบเทียบ" title="เปรียบเทียบ">${this.icons.compare}<span>เทียบ</span></button>
        <span class="badge-type ${l.listing_type}">${this.icons[this.catIcon[l.category] || 'home']} ${this.typeLabel[l.listing_type] || ''}${this.catLabel[l.category] ? ' · ' + this.catLabel[l.category] : ''}</span>
        <span class="price-tag">
          <span class="p">${this.price(l.price, l.listing_type)}</span>
          ${l.listing_type === 'rent' ? '<span class="per">/เดือน</span>' : ''}
        </span>
      </div>
      <div class="body">
        <h3>${this.esc(l.title)}${l.verified ? ` <span class="vfy" title="ตรวจสอบแล้ว">${this.icons.verified}</span>` : ''}</h3>
        ${Number(l.rating_count) > 0 ? `<div class="card-rating"><span class="cr-star">★</span> ${Number(l.rating_avg).toFixed(1)} <span class="cr-count">(${l.rating_count})</span></div>` : ''}
        <div class="loc">${this.icons.pin} ${this.esc(l.location_text || l.province || '-')}</div>
        <div class="spec-row">${specs.map(s => `<span class="spec">${this.icons[s.ic]} ${s.t}</span>`).join('')}</div>
        ${nearby ? `<div class="nearby-row">${nearby}</div>` : ''}
      </div>
    </a>`;
  },

  navbar(active) {
    return `
    <div class="nav"><div class="container nav-inner">
      ${this.brandHtml(false)}
      <nav class="nav-links">
        <a href="/search?type=rent" class="${active === 'rent' ? 'on' : ''}">เช่า</a>
        <a href="/search?type=sale" class="${active === 'sale' ? 'on' : ''}">ซื้อ</a>
        <a href="/search?category=land" class="${active === 'land' ? 'on' : ''}">ที่ดิน</a>
        <a href="/map" class="${active === 'map' ? 'on' : ''}">แผนที่</a>
        <a href="/#categories">ประเภททั้งหมด</a>
      </nav>
      <span class="nav-spacer"></span>
      <div class="nav-actions">
        <div class="pref-group" role="group" aria-label="การแสดงผล">
          <button class="pref-btn" data-theme-toggle type="button" aria-label="สลับโหมดมืด/สว่าง" title="โหมดมืด/สว่าง">${TD.theme() === 'dark' ? this.icons.sun : this.icons.moon}</button>
          <button class="pref-btn" data-lang-toggle type="button" aria-label="Switch language" title="ไทย / English"><span class="lang-code">${TD.lang() === 'en' ? 'ไทย' : 'EN'}</span></button>
        </div>
        <a class="icon-btn" href="/saved" aria-label="รายการโปรด" title="รายการโปรด">${this.icons.heart}</a>
        <button class="icon-btn" id="acctBtn" data-auth aria-label="บัญชีผู้ใช้" title="บัญชีผู้ใช้">${this.icons.user}</button>
        <a class="btn btn-primary btn-sm nav-cta" href="/#list-cta">ติดต่อเรา</a>
      </div>
    </div></div>`;
  },

  footer() {
    return `
    <footer><div class="container">
      <div class="foot-inner">
        <div class="foot-brand">
          ${this.brandHtml(true)}
          <p>แพลตฟอร์มอสังหาริมทรัพย์ที่รวมบ้านเช่า บ้านขาย และที่ดินไว้ในที่เดียว ค้นหาง่าย ข้อมูลครบ ติดต่อตรงถึงเจ้าของ</p>
        </div>
        <div><h4>ค้นหา</h4>
          <a href="/search?type=rent">บ้าน/คอนโดให้เช่า</a>
          <a href="/search?type=sale">บ้าน/คอนโดขาย</a>
          <a href="/search?category=land">ที่ดิน</a>
          <a href="/search?category=commercial">อาคารพาณิชย์</a>
        </div>
        <div><h4>ทำเลยอดนิยม</h4>
          <a href="/area/${encodeURIComponent('กรุงเทพมหานคร')}">กรุงเทพมหานคร</a>
          <a href="/area/${encodeURIComponent('นครปฐม')}">นครปฐม</a>
          <a href="/area/${encodeURIComponent('เชียงใหม่')}">เชียงใหม่</a>
          <a href="/area/${encodeURIComponent('หัวหิน')}">หัวหิน</a>
          <a href="/areas">ดูทำเลทั้งหมด →</a>
        </div>
        <div><h4>เมนูลัด</h4>
          <a href="/discover">ปัดหาบ้านที่ใช่ 🃏</a>
          <a href="/saved">รายการโปรดของฉัน</a>
          <a href="/#list-cta">ติดต่อเรา</a>
          <a href="/admin">เข้าสู่ระบบผู้ดูแล</a>
        </div>
        <div><h4>ข้อมูล</h4>
          <a href="/about">เกี่ยวกับเรา</a>
          <a href="/contact">ติดต่อเรา</a>
          <a href="/privacy">นโยบายความเป็นส่วนตัว</a>
          <a href="/terms">เงื่อนไขการใช้งาน</a>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ${this.esc(this.brand.main + this.brand.accent)} · ${this.esc(this.brand.sub || '')} — All rights reserved</span>
        <span class="foot-legal"><a href="/privacy">ความเป็นส่วนตัว</a> · <a href="/terms">เงื่อนไข</a></span>
      </div>
    </div></footer>`;
  },

  async post(url, body, token) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body)
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || 'เกิดข้อผิดพลาด');
    return j;
  }
};


// global: favorite toggle (ทำงานกับการ์ดทุกใบทุกหน้า)
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fav]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const on = TD.toggleFav(b.dataset.fav);
    b.classList.toggle('on', on);
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    if (TD.user) fetch('/api/user/favorites', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ listing_id: Number(b.dataset.fav), on }) }).catch(() => {});
  });

  // global: compare toggle + floating tray
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-cmp]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const r = TD.toggleCompare(b.dataset.cmp);
    if (r.full) { TD.toast && TD.toast('เปรียบเทียบได้สูงสุด 3 รายการ'); return; }
    document.querySelectorAll(`[data-cmp="${b.dataset.cmp}"]`).forEach(x =>
      x.classList.toggle('on', r.list.includes(Number(b.dataset.cmp))));
    TD.renderCompareTray();
  });
}

TD.REVIEW_ASPECTS = ['เดินทางสะดวก', 'ปลอดภัย', 'เงียบสงบ', 'ร้านอาหาร/คาเฟ่เยอะ', 'ใกล้ห้าง/ตลาด', 'น้ำไม่ท่วม', 'ชุมชนน่าอยู่', 'อากาศดี'];
TD.openReportModal = function (listingId) {
  if (document.querySelector('.rp-ov')) return;
  const reasons = ['ข้อมูลไม่ตรงกับความจริง', 'ประกาศซ้ำ/สแปม', 'ทรัพย์ถูกขาย/เช่าแล้ว', 'รูปภาพไม่เหมาะสม', 'สงสัยว่าหลอกลวง', 'อื่น ๆ'];
  const ov = document.createElement('div');
  ov.className = 'yj-modal-ov rp-ov';
  ov.innerHTML = `
    <div class="yj-modal" role="dialog" aria-modal="true">
      <button class="yj-modal-x" aria-label="ปิด">✕</button>
      <div class="yj-modal-ic">${TD.icons.flag}</div>
      <h3>แจ้งประกาศนี้</h3>
      <p class="yj-modal-sub">ช่วยเราตรวจสอบคุณภาพประกาศ ข้อมูลของคุณจะถูกส่งให้ทีมงาน</p>
      <div class="rp-reasons" id="rpReasons">${reasons.map(r => `<button type="button" data-r="${r}">${r}</button>`).join('')}</div>
      <textarea class="yj-input" id="rpDetail" rows="2" placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"></textarea>
      <div class="yj-msg" id="rpMsg"></div>
      <button class="btn btn-primary" id="rpSubmit" style="width:100%;justify-content:center">ส่งรายงาน</button>
    </div>`;
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
  const close = () => { ov.remove(); document.body.style.overflow = ''; };
  ov.querySelector('.yj-modal-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  let reason = '';
  ov.querySelectorAll('#rpReasons button').forEach(b => b.onclick = () => {
    ov.querySelectorAll('#rpReasons button').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); reason = b.dataset.r;
  });
  ov.querySelector('#rpSubmit').onclick = async () => {
    const msg = ov.querySelector('#rpMsg');
    if (!reason) { msg.textContent = 'กรุณาเลือกเหตุผล'; msg.className = 'yj-msg err'; return; }
    const btn = ov.querySelector('#rpSubmit'); btn.disabled = true;
    msg.textContent = 'กำลังส่ง…'; msg.className = 'yj-msg';
    try {
      await TD.post('/api/reports', { listing_id: listingId, reason, detail: ov.querySelector('#rpDetail').value.trim() });
      ov.querySelector('.yj-modal').innerHTML = `
        <div class="yj-modal-ic ok">${TD.icons.check}</div>
        <h3>ขอบคุณที่แจ้ง</h3>
        <p class="yj-modal-sub">ทีมงานจะตรวจสอบประกาศนี้โดยเร็วครับ</p>
        <button class="btn btn-primary" id="rpDone" style="width:100%;justify-content:center;margin-top:6px">เรียบร้อย</button>`;
      ov.querySelector('#rpDone').onclick = close;
    } catch (e) { btn.disabled = false; msg.textContent = e.message || 'ส่งไม่สำเร็จ'; msg.className = 'yj-msg err'; }
  };
};
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-report]');
    if (b) { e.preventDefault(); TD.openReportModal(Number(b.dataset.report)); }
  });
}

TD.openReviewModal = function (province, onDone) {
  if (!province || document.querySelector('.rv-ov')) return;
  const ov = document.createElement('div');
  ov.className = 'yj-modal-ov rv-ov';
  ov.innerHTML = `
    <div class="yj-modal" role="dialog" aria-modal="true">
      <button class="yj-modal-x" aria-label="ปิด">✕</button>
      <div class="yj-modal-ic">${TD.icons.star || '★'}</div>
      <h3>รีวิวทำเล ${TD.esc(province)}</h3>
      <p class="yj-modal-sub">แบ่งปันประสบการณ์ย่านนี้ให้คนอื่นตัดสินใจง่ายขึ้น</p>
      <div class="rv-stars" id="rvStars">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" aria-label="${n} ดาว">★</button>`).join('')}</div>
      <div class="rv-aspects" id="rvAspects">${TD.REVIEW_ASPECTS.map(a => `<button type="button" data-aspect="${a}">${a}</button>`).join('')}</div>
      <textarea class="yj-input" id="rvComment" rows="3" placeholder="เล่าเพิ่มเติม (ไม่บังคับ) เช่น เดินทางเข้าเมืองสะดวก ร้านอาหารเยอะ"></textarea>
      <input class="yj-input" id="rvAuthor" placeholder="ชื่อ/ชื่อเล่น (ไม่บังคับ)">
      <div class="yj-msg" id="rvMsg"></div>
      <button class="btn btn-primary" id="rvSubmit" style="width:100%;justify-content:center">ส่งรีวิว</button>
    </div>`;
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
  const close = () => { ov.remove(); document.body.style.overflow = ''; };
  ov.querySelector('.yj-modal-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });

  let rating = 0;
  const stars = ov.querySelectorAll('#rvStars button');
  stars.forEach(s => {
    s.onclick = () => { rating = Number(s.dataset.star); stars.forEach((x, i) => x.classList.toggle('on', i < rating)); };
    s.onmouseenter = () => stars.forEach((x, i) => x.classList.toggle('hover', i < Number(s.dataset.star)));
  });
  ov.querySelector('#rvStars').onmouseleave = () => stars.forEach(x => x.classList.remove('hover'));
  const aspects = new Set();
  ov.querySelectorAll('#rvAspects button').forEach(b => b.onclick = () => {
    const a = b.dataset.aspect;
    if (aspects.has(a)) { aspects.delete(a); b.classList.remove('on'); }
    else { aspects.add(a); b.classList.add('on'); }
  });
  ov.querySelector('#rvSubmit').onclick = async () => {
    const msg = ov.querySelector('#rvMsg');
    if (!rating) { msg.textContent = 'กรุณาให้คะแนนดาว'; msg.className = 'yj-msg err'; return; }
    const btn = ov.querySelector('#rvSubmit'); btn.disabled = true;
    msg.textContent = 'กำลังส่ง…'; msg.className = 'yj-msg';
    try {
      await TD.post('/api/area-reviews', {
        province, rating, aspects: [...aspects],
        comment: ov.querySelector('#rvComment').value.trim(),
        author: ov.querySelector('#rvAuthor').value.trim()
      });
      ov.querySelector('.yj-modal').innerHTML = `
        <div class="yj-modal-ic ok">${TD.icons.check}</div>
        <h3>ขอบคุณสำหรับรีวิว!</h3>
        <p class="yj-modal-sub">รีวิวของคุณช่วยให้คนหาบ้านตัดสินใจง่ายขึ้นมากครับ</p>
        <button class="btn btn-primary" id="rvDone" style="width:100%;justify-content:center;margin-top:6px">เรียบร้อย</button>`;
      ov.querySelector('#rvDone').onclick = () => { close(); if (onDone) onDone(); };
    } catch (e) {
      btn.disabled = false; msg.textContent = e.message || 'ส่งไม่สำเร็จ ลองใหม่'; msg.className = 'yj-msg err';
    }
  };
};

TD.openListingReviewModal = function (listingId, onDone) {
  if (!listingId || document.querySelector('.rv-ov')) return;
  const ov = document.createElement('div');
  ov.className = 'yj-modal-ov rv-ov';
  ov.innerHTML = `
    <div class="yj-modal" role="dialog" aria-modal="true">
      <button class="yj-modal-x" aria-label="ปิด">✕</button>
      <div class="yj-modal-ic">${TD.icons.star || '★'}</div>
      <h3>รีวิวทรัพย์นี้</h3>
      <p class="yj-modal-sub">แบ่งปันความเห็นของคุณให้คนอื่นตัดสินใจง่ายขึ้น</p>
      <div class="rv-stars" id="lrvStars">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" aria-label="${n} ดาว">★</button>`).join('')}</div>
      <textarea class="yj-input" id="lrvComment" rows="3" placeholder="เล่าเพิ่มเติม (ไม่บังคับ) เช่น ทำเลดี ห้องกว้าง เจ้าของดูแลดี"></textarea>
      <input class="yj-input" id="lrvAuthor" placeholder="ชื่อ/ชื่อเล่น (ไม่บังคับ)">
      <div style="position:absolute;left:-9999px" aria-hidden="true"><input id="lrvWebsite" tabindex="-1" autocomplete="off"></div>
      <div class="yj-msg" id="lrvMsg"></div>
      <button class="btn btn-primary" id="lrvSubmit" style="width:100%;justify-content:center">ส่งรีวิว</button>
    </div>`;
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
  const close = () => { ov.remove(); document.body.style.overflow = ''; };
  ov.querySelector('.yj-modal-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });

  let rating = 0;
  const stars = ov.querySelectorAll('#lrvStars button');
  stars.forEach(s => {
    s.onclick = () => { rating = Number(s.dataset.star); stars.forEach((x, i) => x.classList.toggle('on', i < rating)); };
    s.onmouseenter = () => stars.forEach((x, i) => x.classList.toggle('hover', i < Number(s.dataset.star)));
  });
  ov.querySelector('#lrvStars').onmouseleave = () => stars.forEach(x => x.classList.remove('hover'));
  ov.querySelector('#lrvSubmit').onclick = async () => {
    const msg = ov.querySelector('#lrvMsg');
    if (!rating) { msg.textContent = 'กรุณาให้คะแนนดาว'; msg.className = 'yj-msg err'; return; }
    const btn = ov.querySelector('#lrvSubmit'); btn.disabled = true;
    msg.textContent = 'กำลังส่ง…'; msg.className = 'yj-msg';
    try {
      await TD.post('/api/listing-reviews', {
        listing_id: listingId, rating,
        comment: ov.querySelector('#lrvComment').value.trim(),
        author: ov.querySelector('#lrvAuthor').value.trim(),
        website: ov.querySelector('#lrvWebsite').value
      });
      ov.querySelector('.yj-modal').innerHTML = `
        <div class="yj-modal-ic ok">${TD.icons.check}</div>
        <h3>ขอบคุณสำหรับรีวิว!</h3>
        <p class="yj-modal-sub">รีวิวของคุณช่วยให้คนหาบ้านตัดสินใจง่ายขึ้นมากครับ</p>
        <button class="btn btn-primary" id="lrvDone" style="width:100%;justify-content:center;margin-top:6px">เรียบร้อย</button>`;
      ov.querySelector('#lrvDone').onclick = () => { close(); if (onDone) onDone(); };
    } catch (e) {
      btn.disabled = false; msg.textContent = e.message || 'ส่งไม่สำเร็จ ลองใหม่'; msg.className = 'yj-msg err';
    }
  };
};

TD.openConcierge = function () {
  if (document.querySelector('.cc-ov')) return;
  const ov = document.createElement('div');
  ov.className = 'cc-ov';
  ov.innerHTML = `
    <div class="cc-modal" role="dialog" aria-modal="true">
      <div class="cc-head">
        <div class="cc-head-t">${TD.icons.sparkles} <b>ผู้ช่วยหาบ้าน AI</b></div>
        <button class="cc-x" aria-label="ปิด">✕</button>
      </div>
      <div class="cc-log" id="ccLog"></div>
      <div class="cc-input">
        <input id="ccInput" placeholder="พิมพ์บอกความต้องการ เช่น คอนโดเช่าใกล้ BTS งบ 2 หมื่น" autocomplete="off">
        <button class="cc-send" id="ccSend" aria-label="ส่ง">${TD.icons.arrowRight}</button>
      </div>
    </div>`;
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
  const log = ov.querySelector('#ccLog'), input = ov.querySelector('#ccInput');
  const close = () => { ov.remove(); document.body.style.overflow = ''; };
  ov.querySelector('.cc-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });

  const bubble = (who, html) => {
    const d = document.createElement('div');
    d.className = 'cc-msg ' + who;
    d.innerHTML = html;
    log.appendChild(d); log.scrollTop = log.scrollHeight;
    return d;
  };
  // greeting + example chips
  bubble('bot', 'สวัสดีครับ 🙌 บอกผมได้เลยว่ากำลังมองหาบ้านแบบไหน เดี๋ยวผมคัดให้');
  const chips = ['คอนโดเช่าใกล้ BTS ไม่เกิน 2 หมื่น', 'บ้านเดี่ยวนครปฐม 3 ห้องนอน', 'ที่ดินลงทุน', 'คอนโดวิวแม่น้ำ'];
  const chipWrap = document.createElement('div');
  chipWrap.className = 'cc-chips';
  chipWrap.innerHTML = chips.map(c => `<button type="button">${c}</button>`).join('');
  log.appendChild(chipWrap);
  chipWrap.querySelectorAll('button').forEach(b => b.onclick = () => { input.value = b.textContent; send(); });

  let busy = false;
  async function send() {
    const msg = input.value.trim();
    if (!msg || busy) return;
    busy = true; input.value = '';
    if (chipWrap.parentElement) chipWrap.remove();
    bubble('user', TD.esc(msg));
    const typing = bubble('bot typing', '<span></span><span></span><span></span>');
    try {
      const r = await TD.post('/api/concierge', { message: msg });
      typing.remove();
      bubble('bot', TD.esc(r.reply || 'ลองใหม่อีกครั้งครับ'));
      if (r.items && r.items.length) {
        const wrap = document.createElement('div');
        wrap.className = 'cc-cards';
        wrap.innerHTML = r.items.map(l => TD.card(l)).join('');
        log.appendChild(wrap); log.scrollTop = log.scrollHeight;
      } else if (r.filters) {
        const q = new URLSearchParams();
        Object.entries(r.filters).forEach(([k, v]) => { if (v) q.set(k, v); });
        const d = bubble('bot', `<a class="cc-alt" href="/search?${q.toString()}">ดูผลการค้นหาทั้งหมด →</a>`);
      }
    } catch (e) {
      typing.remove();
      bubble('bot', 'ขออภัยครับ ระบบขัดข้องชั่วคราว ลองใหม่อีกครั้ง');
    }
    busy = false; input.focus();
  }
  ov.querySelector('#ccSend').onclick = send;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  setTimeout(() => input.focus(), 100);
};

// launcher: ปุ่มที่มี data-concierge
if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-concierge]')) { e.preventDefault(); TD.openConcierge(); }
  });
}

TD.openAlertModal = function (criteria) {
  criteria = criteria || {};
  const catL = { condo: 'คอนโด', house: 'บ้านเดี่ยว', townhouse: 'ทาวน์เฮาส์', land: 'ที่ดิน', commercial: 'อาคารพาณิชย์' };
  const typeL = { rent: 'เช่า', sale: 'ขาย' };
  const parts = [];
  if (criteria.type) parts.push(typeL[criteria.type]);
  if (criteria.category) parts.push(catL[criteria.category]);
  if (criteria.province) parts.push(criteria.province);
  if (criteria.q) parts.push('“' + criteria.q + '”');
  if (criteria.max) parts.push('ไม่เกิน ' + Number(criteria.max).toLocaleString());
  if (criteria.beds) parts.push(criteria.beds + '+ ห้องนอน');
  const summary = parts.join(' · ') || 'ทุกประกาศใหม่';

  const ov = document.createElement('div');
  ov.className = 'yj-modal-ov';
  ov.innerHTML = `
    <div class="yj-modal" role="dialog" aria-modal="true">
      <button class="yj-modal-x" aria-label="ปิด">✕</button>
      <div class="yj-modal-ic">${TD.icons.bell}</div>
      <h3>แจ้งเตือนทรัพย์ตรงใจ</h3>
      <p class="yj-modal-sub">เมื่อมีประกาศใหม่ตรงเงื่อนไขนี้ ทีมงานจะติดต่อแจ้งคุณทันที</p>
      <div class="yj-crit">${TD.esc(summary)}</div>
      <div class="yj-field">
        <label>ช่องทางให้ติดต่อกลับ</label>
        <div class="yj-chan">
          <button type="button" class="yj-chan-b on" data-chan="line">LINE</button>
          <button type="button" class="yj-chan-b" data-chan="phone">เบอร์โทร</button>
          <button type="button" class="yj-chan-b" data-chan="email">อีเมล</button>
        </div>
      </div>
      <input class="yj-input" id="yjContact" placeholder="LINE ID ของคุณ">
      <div class="yj-msg" id="yjAlertMsg"></div>
      <button class="btn btn-primary" id="yjAlertSubmit" style="width:100%;justify-content:center">ตั้งการแจ้งเตือน</button>
    </div>`;
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';

  let chan = 'line';
  const ph = { line: 'LINE ID ของคุณ', phone: 'เบอร์โทรของคุณ', email: 'อีเมลของคุณ' };
  const input = ov.querySelector('#yjContact');
  const close = () => { ov.remove(); document.body.style.overflow = ''; };
  ov.querySelector('.yj-modal-x').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.querySelectorAll('.yj-chan-b').forEach(b => b.onclick = () => {
    ov.querySelectorAll('.yj-chan-b').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); chan = b.dataset.chan;
    input.placeholder = ph[chan]; input.type = chan === 'email' ? 'email' : 'text';
  });
  ov.querySelector('#yjAlertSubmit').onclick = async () => {
    const contact = input.value.trim();
    const msg = ov.querySelector('#yjAlertMsg');
    if (!contact) { msg.textContent = 'กรุณากรอกช่องทางติดต่อ'; msg.className = 'yj-msg err'; input.focus(); return; }
    const btn = ov.querySelector('#yjAlertSubmit');
    btn.disabled = true; msg.textContent = 'กำลังบันทึก…'; msg.className = 'yj-msg';
    try {
      await TD.post('/api/saved-searches', { ...criteria, label: summary, channel: chan, contact });
      ov.querySelector('.yj-modal').innerHTML = `
        <div class="yj-modal-ic ok">${TD.icons.check}</div>
        <h3>ตั้งการแจ้งเตือนแล้ว!</h3>
        <p class="yj-modal-sub">พอมีทรัพย์ใหม่ตรงเงื่อนไข “${TD.esc(summary)}” เราจะรีบติดต่อกลับทาง ${chan.toUpperCase()} ทันที</p>
        <button class="btn btn-primary" id="yjDone" style="width:100%;justify-content:center;margin-top:6px">เรียบร้อย</button>`;
      ov.querySelector('#yjDone').onclick = close;
    } catch (e) {
      btn.disabled = false; msg.textContent = e.message || 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง'; msg.className = 'yj-msg err';
    }
  };
  input.focus();
};

// ============ User accounts (login/register) ============
TD.user = null;
TD.loadUser = async function () {
  try {
    const r = await fetch('/api/auth/me').then(x => x.json());
    TD.user = r.user || null;
  } catch { TD.user = null; }
  TD.renderAcct();
  if (TD.user) TD.syncFavsFromServer();
};
TD.renderAcct = function () {
  const btn = document.getElementById('acctBtn');
  if (!btn) return;
  if (TD.user) {
    btn.classList.add('signed');
    btn.title = TD.user.name || TD.user.email;
    btn.innerHTML = `<span class="acct-ini">${(TD.user.name || TD.user.email || '?').trim().charAt(0).toUpperCase()}</span>`;
  } else {
    btn.classList.remove('signed');
    btn.title = 'เข้าสู่ระบบ';
    btn.innerHTML = TD.icons.user;
  }
};
TD.syncFavsFromServer = async function () {
  try {
    const r = await fetch('/api/user/favorites').then(x => x.json());
    if (!r.ids) return;
    const local = TD.favs();
    const merged = [...new Set([...local, ...r.ids.map(Number)])];
    localStorage.setItem('teedee_favs', JSON.stringify(merged));
    document.querySelectorAll('[data-fav]').forEach(b => {
      if (merged.includes(Number(b.dataset.fav))) b.classList.add('on');
    });
  } catch {}
};

if (typeof document !== 'undefined') {
  document.addEventListener('click', e => {
    if (e.target.closest('[data-auth]')) { e.preventDefault(); TD.user ? TD.openAccountMenu(e.target.closest('[data-auth]')) : TD.openAuthModal('login'); }
  });
}

TD.openAccountMenu = function (anchor) {
  document.getElementById('acctMenu')?.remove();
  const m = document.createElement('div');
  m.id = 'acctMenu'; m.className = 'acct-menu';
  m.innerHTML = `
    <div class="acct-head">${TD.esc(TD.user.name || 'คุณ')}<span>${TD.esc(TD.user.email)}</span></div>
    <a href="/saved">${TD.icons.heart} รายการโปรดของฉัน</a>
    <button type="button" id="logoutU">${TD.icons.user} ออกจากระบบ</button>`;
  document.body.appendChild(m);
  const r = anchor.getBoundingClientRect();
  m.style.top = (r.bottom + 8) + 'px';
  m.style.right = (window.innerWidth - r.right) + 'px';
  const close = (ev) => { if (!m.contains(ev.target) && ev.target !== anchor) { m.remove(); document.removeEventListener('click', close); } };
  setTimeout(() => document.addEventListener('click', close), 0);
  m.querySelector('#logoutU').onclick = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    TD.user = null; TD.renderAcct(); m.remove();
    TD.toast && TD.toast('ออกจากระบบแล้ว');
  };
};

TD.openAuthModal = function (mode) {
  if (document.querySelector('.au-ov')) return;
  mode = mode || 'login';
  const ov = document.createElement('div');
  ov.className = 'yj-modal-ov au-ov';
  const render = () => {
    const isLogin = mode === 'login';
    ov.querySelector('.yj-modal').innerHTML = `
      <button class="yj-modal-x" aria-label="ปิด">✕</button>
      <div class="yj-modal-ic">${TD.icons.user}</div>
      <h3>${isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</h3>
      <p class="yj-modal-sub">${isLogin ? 'เข้าสู่ระบบเพื่อเก็บรายการโปรดข้ามอุปกรณ์' : 'สมัครฟรี เก็บรายการโปรดและการแจ้งเตือนไว้กับบัญชีคุณ'}</p>
      ${isLogin ? '' : '<input class="yj-input" id="auName" placeholder="ชื่อ (ไม่บังคับ)">'}
      <input class="yj-input" id="auEmail" type="email" placeholder="อีเมล" autocomplete="email">
      <input class="yj-input" id="auPass" type="password" placeholder="รหัสผ่าน${isLogin ? '' : ' (อย่างน้อย 6 ตัว)'}" autocomplete="${isLogin ? 'current-password' : 'new-password'}">
      <div class="yj-msg" id="auMsg"></div>
      <button class="btn btn-primary" id="auSubmit" style="width:100%;justify-content:center">${isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</button>
      <p class="au-switch">${isLogin ? 'ยังไม่มีบัญชี?' : 'มีบัญชีแล้ว?'} <button type="button" id="auSwitch">${isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}</button></p>`;
    bind();
  };
  ov.innerHTML = '<div class="yj-modal" role="dialog" aria-modal="true"></div>';
  document.body.appendChild(ov);
  document.body.style.overflow = 'hidden';
  const close = () => { ov.remove(); document.body.style.overflow = ''; };

  function bind() {
    ov.querySelector('.yj-modal-x').onclick = close;
    ov.querySelector('#auSwitch').onclick = () => { mode = mode === 'login' ? 'register' : 'login'; render(); };
    ov.querySelector('#auSubmit').onclick = submit;
    ov.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); }));
  }
  ov.addEventListener('click', e => { if (e.target === ov) close(); });

  async function submit() {
    const msg = ov.querySelector('#auMsg');
    const email = ov.querySelector('#auEmail').value.trim();
    const password = ov.querySelector('#auPass').value;
    const name = ov.querySelector('#auName')?.value.trim() || '';
    if (!email || !password) { msg.textContent = 'กรุณากรอกอีเมลและรหัสผ่าน'; msg.className = 'yj-msg err'; return; }
    const btn = ov.querySelector('#auSubmit'); btn.disabled = true;
    msg.textContent = 'กำลังดำเนินการ…'; msg.className = 'yj-msg';
    try {
      const path = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const r = await TD.post(path, { email, password, name, favorites: TD.favs() });
      TD.user = r.user; TD.renderAcct(); TD.syncFavsFromServer();
      close(); TD.toast && TD.toast(mode === 'login' ? 'เข้าสู่ระบบแล้ว' : 'สมัครสมาชิกสำเร็จ!');
    } catch (e) {
      btn.disabled = false; msg.textContent = e.message || 'เกิดข้อผิดพลาด'; msg.className = 'yj-msg err';
    }
  }
  render();
  setTimeout(() => ov.querySelector('#auEmail')?.focus(), 100);
};

TD.toast = function (msg) {
  let t = document.getElementById('yjToast');
  if (!t) { t = document.createElement('div'); t.id = 'yjToast'; t.className = 'yj-toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(TD._toastT); TD._toastT = setTimeout(() => t.classList.remove('show'), 2200);
};

TD.renderCompareTray = function () {
  if (typeof document === 'undefined') return;
  let tray = document.getElementById('cmpTray');
  const list = this.compareList();
  // ไม่ต้องโชว์แถบลอยบนหน้าเปรียบเทียบเอง (ซ้ำซ้อน)
  if (location.pathname === '/compare') { if (tray) tray.remove(); return; }
  if (!list.length) { if (tray) tray.remove(); return; }
  if (!tray) {
    tray = document.createElement('div');
    tray.id = 'cmpTray'; tray.className = 'cmp-tray';
    document.body.appendChild(tray);
  }
  tray.innerHTML = `
    <span class="cmp-tray-count">${this.icons.compare} เลือกเทียบ ${list.length}/3</span>
    <div class="cmp-tray-actions">
      <button type="button" class="cmp-clear">ล้าง</button>
      <a class="cmp-go" href="/compare">เปรียบเทียบ ${this.icons.arrowRight}</a>
    </div>`;
  tray.querySelector('.cmp-clear').onclick = () => {
    localStorage.setItem('yj_compare', '[]');
    document.querySelectorAll('[data-cmp].on').forEach(x => x.classList.remove('on'));
    this.renderCompareTray();
  };
};
if (typeof document !== 'undefined') {
  const bootTray = () => TD.renderCompareTray();
  if (document.body) bootTray(); else document.addEventListener('DOMContentLoaded', bootTray);
}


/* ============ Theme (Dark Mode) + Bilingual (TH/EN) engine ============ */
TD.THEME_KEY = 'yj_theme';
TD.LANG_KEY = 'yj_lang';
TD.theme = function () { try { return localStorage.getItem(this.THEME_KEY) === 'dark' ? 'dark' : 'light'; } catch (e) { return 'light'; } };
TD.lang = function () { try { return localStorage.getItem(this.LANG_KEY) === 'en' ? 'en' : 'th'; } catch (e) { return 'th'; } };
TD.setTheme = function (t) {
  t = t === 'dark' ? 'dark' : 'light';
  try { localStorage.setItem(this.THEME_KEY, t); } catch (e) {}
  document.documentElement.dataset.theme = t;
  if (this.renderChrome) this.renderChrome();
};
TD.toggleTheme = function () { this.setTheme(this.theme() === 'dark' ? 'light' : 'dark'); };
TD.setLang = function (l) {
  l = l === 'en' ? 'en' : 'th';
  try { localStorage.setItem(this.LANG_KEY, l); } catch (e) {}
  location.reload();
};

/* พจนานุกรม ไทย → อังกฤษ (แปล UI เท่านั้น เนื้อหาที่เจ้าของกรอกคงเดิม) */
TD.EN = {
  // ---- Navbar / chrome ----
  'เช่า': 'Rent', 'ซื้อ': 'Buy', 'ขาย': 'Sale', 'ที่ดิน': 'Land', 'ประเภททั้งหมด': 'All Types',
  'ลงประกาศ': 'List Property', 'ติดต่อเรา': 'Contact us', 'รายการโปรด': 'Saved', 'หน้าแรก': 'Home', 'โปรด': 'Saved',
  // ---- Footer ----
  'ค้นหา': 'Search', 'บ้าน/คอนโดให้เช่า': 'Homes & condos for rent', 'บ้าน/คอนโดขาย': 'Homes & condos for sale',
  'อาคารพาณิชย์': 'Commercial', 'ทำเลยอดนิยม': 'Popular Areas', 'เมนูลัด': 'Quick Links',
  'รายการโปรดของฉัน': 'My Saved List', 'ลงประกาศฟรี': 'List for free', 'เข้าสู่ระบบผู้ดูแล': 'Admin login',
  'กรุงเทพมหานคร': 'Bangkok', 'นครปฐม': 'Nakhon Pathom', 'เชียงใหม่': 'Chiang Mai', 'หัวหิน': 'Hua Hin',
  'ดูทำเลทั้งหมด →': 'View all areas →', 'ดูทำเลทั้งหมด': 'View all areas', 'ทุกจังหวัด': 'All provinces',
  'แพลตฟอร์มอสังหาริมทรัพย์ที่รวมบ้านเช่า บ้านขาย และที่ดินไว้ในที่เดียว ค้นหาง่าย ข้อมูลครบ ติดต่อตรงถึงเจ้าของ':
    'A property platform bringing homes for rent, homes for sale, and land together in one place — easy to search, full details, and direct contact with owners.',
  'ทำด้วยใจ เพื่อคนหาบ้าน 🏡': 'Made with care, for home seekers 🏡',
  // ---- Home hero ----
  'บ้านเช่า · บ้านขาย · ที่ดิน ทั่วไทย': 'Homes for rent · for sale · land — nationwide',
  'พิมพ์ภาษาคนได้เลย เช่น "คอนโดเลี้ยงแมวได้ ใกล้ BTS ไม่เกิน 2 หมื่น" — AI จะตีความให้':
    'Type naturally, e.g. "cat-friendly condo near BTS under ฿20k" — AI will interpret it for you',
  'ค้นหาบ้านเช่า คอนโด บ้านขาย และที่ดินจากทั่วประเทศ ข้อมูลครบทุกมิติ ติดต่อเจ้าของได้โดยตรง':
    'Search homes for rent, condos, properties for sale, and land nationwide — complete details, contact owners directly.',
  // ---- Search bar ----
  'ทั้งหมด': 'All', 'ทุกประเภททรัพย์': 'All property types', 'คอนโด': 'Condo', 'บ้านเดี่ยว': 'House',
  'ทาวน์เฮาส์': 'Townhouse', 'ทุกช่วงราคา': 'Any price',
  'เช่า · ไม่เกิน 15,000': 'Rent · up to ฿15,000', 'เช่า · 15,000 – 30,000': 'Rent · ฿15,000–30,000',
  'เช่า · 30,000 – 60,000': 'Rent · ฿30,000–60,000', 'ซื้อ · ไม่เกิน 3 ล้าน': 'Buy · up to ฿3M',
  'ซื้อ · 3 – 6 ล้าน': 'Buy · ฿3M–6M', 'ซื้อ · 6 ล้านขึ้นไป': 'Buy · ฿6M+',
  'ยอดนิยม': 'Popular', 'ให้ AI ช่วยหา': 'Ask AI', 'ปัดหาบ้าน': 'Swipe homes', 'ปัดหาบ้านที่ใช่ 🃏': 'Swipe to find home 🃏', 'คอนโดใกล้ BTS': 'Condos near BTS', 'บ้านนครปฐม': 'Houses in Nakhon Pathom',
  'เกี่ยวกับเรา': 'About us', 'นโยบายความเป็นส่วนตัว': 'Privacy Policy', 'เงื่อนไขการใช้งาน': 'Terms of Use',
  'ข้อมูล': 'Information', 'ความเป็นส่วนตัว': 'Privacy', 'เงื่อนไข': 'Terms',
  'ดูรายละเอียด →': 'View details →', 'ปัดครบทุกหลังแล้ว!': 'You swiped them all!',
  'ค้นหาแบบละเอียด': 'Advanced search', 'ดูรายการโปรด': 'View favorites',
  'คัดมาเพื่อคุณ ✨': 'Picked for you ✨', 'ดูเพิ่มเติม': 'See more',
  '1+ ห้องน้ำ': '1+ baths', '2+ ห้องน้ำ': '2+ baths', '3+ ห้องน้ำ': '3+ baths',
  'รีวิวดีที่สุด': 'Best rated', 'ล้างทั้งหมด': 'Clear all',
  'รีวิวจากผู้เข้าชม': 'Visitor reviews', 'เขียนรีวิว': 'Write a review',
  'ยังไม่มีรีวิว เป็นคนแรกเลย!': 'No reviews yet — be the first!', 'รีวิวทรัพย์นี้': 'Review this property', 'ส่งรีวิว': 'Submit review',
  'ไม่พบหน้าที่คุณตามหา': "Page not found", 'กลับหน้าแรก': 'Back to home', 'ค้นหาทรัพย์': 'Search properties',
  'บ้านเช่าเชียงใหม่': 'Rentals in Chiang Mai', 'ที่ดินทั้งหมด': 'All land', 'เลี้ยงสัตว์ได้': 'Pet-friendly',
  // ---- Home sections ----
  'ประกาศแนะนำ': 'Featured Listings', 'คัดมาให้เฉพาะประกาศเด่น ข้อมูลครบ พร้อมติดต่อ': 'Hand-picked standout listings, full details, ready to contact',
  'ดูทั้งหมด': 'View all', 'ดูล่าสุด': 'Recently Viewed', 'ประกาศที่คุณเพิ่งเปิดดู': 'Listings you viewed recently',
  'เลือกดูตามประเภท': 'Browse by Type', 'อยากได้แบบไหน เข้าดูได้ตรงหมวดเลย': 'Jump straight to the category you want',
  'ประกาศมาใหม่': 'New Listings', 'อัปเดตล่าสุดจากเจ้าของทั่วประเทศ': 'The latest updates from owners nationwide',
  'เลือกดูตามจังหวัดที่มีประกาศมากที่สุด': 'Browse the provinces with the most listings',
  'ทำไมต้องอยู่ใจ': 'Why Yoojai', 'เราตั้งใจให้การหาบ้านเป็นเรื่องง่ายและโปร่งใสที่สุด': 'We make finding a home as simple and transparent as possible',
  'มีบ้านหรือที่ดินอยากปล่อยเช่า/ขาย?': 'Have a home or land to rent or sell?',
  'ฝากทรัพย์ไว้กับเราฟรี ทีมงานช่วยตรวจสอบข้อมูลและเขียนคอนเทนต์ให้น่าสนใจด้วย AI':
    'List with us for free — our team verifies your details and writes engaging content with AI.',
  'ติดต่อลงประกาศ': 'List your property', 'ฝากข้อมูลไว้ ทีมงานติดต่อกลับ': 'Leave your details and we\u2019ll get back to you',
  'ส่งข้อมูล': 'Submit', 'ยังไม่มีประกาศแนะนำ': 'No featured listings yet',
  'ประกาศทั้งหมด': 'All listings', 'สำหรับเช่า': 'For rent', 'สำหรับขาย': 'For sale',
  'ใกล้รถไฟฟ้า พร้อมอยู่': 'Near transit, move-in ready', 'พื้นที่กว้าง เป็นส่วนตัว': 'Spacious & private',
  'คุ้มค่า ทำเลดี': 'Great value, prime spot', 'ปลูกสร้าง / ลงทุน': 'Build / invest', 'ทำเลค้าขาย': 'Prime for business',
  'ข้อมูลตรวจสอบแล้ว': 'Verified information', 'ทุกประกาศผ่านการคัดกรองจากทีมงาน ราคาและรายละเอียดตรงตามจริง': 'Every listing is screened by our team — prices and details are accurate',
  'ค้นหาตามไลฟ์สไตล์': 'Search by lifestyle', 'กรองได้ทั้งงบ ทำเล ขนาด และเงื่อนไขอย่างเลี้ยงสัตว์ได้': 'Filter by budget, location, size, and conditions like pet-friendly',
  'ติดต่อตรง ไม่ผ่านคนกลาง': 'Contact directly, no middleman', 'คุยกับเจ้าของหรือผู้ดูแลทรัพย์ได้ทันที ไม่มีค่านายหน้าแอบแฝง': 'Talk to owners or property managers instantly — no hidden agent fees',
  'ครบทั้งเช่า ซื้อ และที่ดิน': 'Rent, buy, and land — all in one', 'ไม่ต้องเปิดหลายเว็บ ที่นี่รวมทุกประเภททรัพย์ไว้ให้แล้ว': 'No need for multiple sites — every property type is here',
  // ---- Search / listings page ----
  'ค้นหาอสังหาริมทรัพย์': 'Search Properties', 'กรองตามประเภท งบประมาณ และทำเลที่ต้องการ': 'Filter by type, budget, and the location you want',
  'กำลังโหลด...': 'Loading…', 'ทุกประเภท': 'All types', 'เรียงลำดับ': 'Sort by', 'แนะนำก่อน': 'Recommended',
  'มาใหม่ล่าสุด': 'Newest', 'ราคาต่ำ → สูง': 'Price: low → high', 'ราคาสูง → ต่ำ': 'Price: high → low',
  'ราคาต่ำสุด': 'Min price', 'ราคาสูงสุด': 'Max price', 'ห้องนอน': 'Bedrooms', 'เช่า + ขาย': 'Rent & Sale',
  'ประกาศให้เช่า': 'Listings for Rent', 'ประกาศขาย': 'Listings for Sale', 'ดูประกาศทั้งหมด': 'View all listings',
  'ลองปรับตัวกรอง เช่น ขยายช่วงราคา หรือลบคำค้นบางส่วน': 'Try adjusting filters — widen the price range or remove some keywords',
  'ไม่พบประกาศที่ตรงเงื่อนไข': 'No listings match your filters',
  'ทำเล, ชื่อโครงการ, คำค้น...': 'Location, project name, keyword…',
  // ---- Saved page ----
  'ยังไม่มีรายการโปรด': 'No saved listings yet', 'กดรูปหัวใจบนประกาศที่ถูกใจ แล้วกลับมาดูที่นี่ได้เลย': 'Tap the heart on listings you like, then come back here anytime',
  'เริ่มค้นหา': 'Start searching',
  // ---- Listing page: sections ----
  'รายละเอียด': 'Description', 'ข้อมูลทรัพย์': 'Property Details', 'จุดเด่น': 'Highlights',
  'สถานที่ใกล้เคียง': 'Nearby Places', 'ตำแหน่งที่ตั้ง': 'Location', 'สำรวจย่านนี้': 'Explore the Area',
  'เวลา/ระยะเดินทางจากที่นี่': 'Travel Time & Distance', 'นัดชมสถานที่จริง': 'Schedule a Viewing',
  'ประกาศใกล้เคียง': 'Similar Listings', 'เฟอร์นิเจอร์และเครื่องใช้ที่ให้': 'Furniture & Appliances Included',
  'สิ่งอำนวยความสะดวกส่วนกลาง': 'Common Facilities', 'คำนวณผ่อนต่อเดือน': 'Monthly Payment Calculator',
  'เงินดาวน์': 'Down payment', 'ดอกเบี้ยต่อปี': 'Interest rate / yr', 'ระยะเวลากู้': 'Loan term', 'ผ่อนประมาณ': 'Est. monthly',
  'ราคาขาย': 'Sale price', 'ค่าเช่า': 'Rent',
  'สนใจประกาศนี้? ทักหาเราเลย': 'Interested? Get in touch', 'หรือฝากข้อความไว้': 'Or leave a message',
  'ชื่อของคุณ *': 'Your name *', 'เบอร์โทร': 'Phone number', 'LINE ID': 'LINE ID',
  'ข้อความ เช่น ขอนัดดูห้องวันเสาร์นี้': 'Message, e.g. I\u2019d like to view this Saturday',
  'ส่งข้อความติดต่อ': 'Send message', 'ทีมงานจะส่งต่อให้ผู้ดูแลทรัพย์ติดต่อกลับโดยเร็ว': 'We\u2019ll forward this to the property manager to contact you soon',
  'คัดลอกลิงก์': 'Copy link', 'แชร์': 'Share', 'ดูเส้นทาง': 'Directions', 'คัดลอกลิงก์นี้:': 'Copy this link:', '✓ คัดลอกแล้ว': '✓ Copied',
  // ---- Explore area categories ----
  'การเดินทาง': 'Transport', 'ช้อปปิ้ง': 'Shopping', 'สุขภาพ': 'Health', 'การศึกษา': 'Education', 'ไลฟ์สไตล์': 'Lifestyle', 'ใกล้': 'Near',
  // ---- Commute ----
  'สนามบินสุวรรณภูมิ': 'Suvarnabhumi Airport', 'สนามบินดอนเมือง': 'Don Mueang Airport',
  'สยาม / ใจกลางกรุงเทพฯ': 'Siam / central Bangkok', 'สถานีกลางกรุงเทพอภิวัฒน์': 'Krung Thep Aphiwat Central Station',
  // ---- Viewing form ----
  'เลือกวัน-เวลาที่สะดวก ทีมงานจะยืนยันนัดกลับโดยเร็ว': 'Pick a convenient date and time — we\u2019ll confirm your appointment soon',
  'วันที่': 'Date', 'ช่วงเวลา': 'Time slot', 'ชื่อ': 'Name', 'เบอร์/LINE': 'Phone / LINE',
  'ช่วงเช้า (09:00–12:00)': 'Morning (09:00–12:00)', 'ช่วงบ่าย (12:00–15:00)': 'Afternoon (12:00–15:00)',
  'ช่วงเย็น (15:00–18:00)': 'Evening (15:00–18:00)', 'ยืดหยุ่นได้ / แล้วแต่สะดวก': 'Flexible / whenever suits',
  'ชื่อของคุณ *': 'Your name *', 'เบอร์โทร หรือ LINE ID *': 'Phone or LINE ID *', 'ขอนัดเข้าชม': 'Request viewing',
  'ส่งคำขอนัดชมแล้ว!': 'Viewing request sent!', 'กรุณาเลือกวันที่': 'Please choose a date',
  'กรุณากรอกชื่อ และเบอร์/LINE': 'Please enter your name and phone/LINE', 'กำลังส่ง…': 'Sending…',
  'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง': 'Couldn\u2019t send. Please try again.',
  'พิมพ์จุดหมาย เช่น ที่ทำงาน มหาวิทยาลัย…': 'Enter a destination, e.g. office, university…',
  '* ระยะเป็นเส้นตรงโดยประมาณ — กด': '* Distances are approximate straight-line — tap',
  'เพื่อดูเวลาจริงและเส้นทางขับรถใน Google Maps': 'to see real travel time and driving routes in Google Maps',
  '* ตำแหน่งโดยประมาณจากชื่อทำเล': '* Approximate location based on the area name',
  // ---- Property facts ----
  'ประเภททรัพย์': 'Property type', 'พื้นที่ใช้สอย': 'Usable area', 'ขนาดที่ดิน': 'Land size', 'ชั้น': 'Floor',
  'รูปแบบ': 'Type', 'ค่าส่วนกลาง': 'Common fee', 'ปีที่สร้างเสร็จ': 'Year built', 'รหัสประกาศ': 'Listing ID',
  'ราคาต่อ ตร.ม.': 'Price per sqm', 'สัตว์เลี้ยง': 'Pets', 'เลี้ยงได้': 'Allowed', 'ไม่อนุญาต': 'Not allowed',
  'ไม่อนุญาตสัตว์เลี้ยง': 'No pets', 'ให้เช่า': 'For Rent', 'แผนที่': 'Map',
  'เปิดใน Google Maps': 'Open in Google Maps', 'นำทางไปที่นี่': 'Get directions',
  '⭐ แนะนำ': '⭐ Featured', 'แนะนำ': 'Featured',
  // ---- Listing states / gallery ----
  'ไม่พบประกาศนี้': 'Listing not found', 'ประกาศอาจถูกปิดไปแล้ว': 'This listing may have been removed',
  'ดูประกาศอื่น': 'Browse other listings', 'บันทึกรายการโปรด': 'Save to favorites',
  'รูปก่อนหน้า': 'Previous image', 'รูปถัดไป': 'Next image', 'ปิด': 'Close',
  // ---- Compare ----
  'เทียบ': 'Compare', 'ล้าง': 'Clear', 'เปรียบเทียบ': 'Compare', 'เปรียบเทียบทรัพย์': 'Compare Properties',
  'ดูข้อมูลเทียบกันแบบเคียงข้าง เลือกทรัพย์ที่ใช่ได้ง่ายขึ้น': 'See properties side by side to pick the right one more easily',
  'ราคา': 'Price', 'ประเภท': 'Type', 'ทำเล': 'Location', 'ห้องน้ำ': 'Bathrooms',
  'ผ่อน/เดือน (ประเมิน)': 'Est. monthly', 'สิ่งอำนวยความสะดวก': 'Facilities', 'ดูประกาศ': 'View listing',
  'ยังไม่ได้เลือกทรัพย์เพื่อเปรียบเทียบ': 'No properties selected to compare',
  'กดปุ่ม “เทียบ” บนการ์ดประกาศ (เลือกได้สูงสุด 3 รายการ) แล้วกลับมาที่นี่': 'Tap “Compare” on listing cards (up to 3), then come back here',
  'ไปเลือกทรัพย์': 'Browse properties', 'เอาออก': 'Remove', 'เปรียบเทียบได้สูงสุด 3 รายการ': 'You can compare up to 3',
  // ---- Alerts ----
  'แจ้งเตือนทรัพย์แบบนี้': 'Alert me for similar', 'ตั้งแจ้งเตือนไว้': 'Set an alert',
  'แจ้งเตือนทรัพย์ตรงใจ': 'Property Alerts', 'ตั้งการแจ้งเตือน': 'Set alert',
  'เมื่อมีประกาศใหม่ตรงเงื่อนไขนี้ ทีมงานจะติดต่อแจ้งคุณทันที': 'When a new listing matches, our team will contact you right away',
  'ช่องทางให้ติดต่อกลับ': 'How should we reach you?', 'เบอร์โทร': 'Phone', 'อีเมล': 'Email',
  'ตั้งการแจ้งเตือนแล้ว!': 'Alert set!', 'เรียบร้อย': 'Done', 'กรุณากรอกช่องทางติดต่อ': 'Please enter your contact',
  'กำลังบันทึก…': 'Saving…', 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง': 'Couldn\u2019t save, please try again',
  // ---- Calc affordability ----
  'เช็กว่าผ่อนไหวไหม': 'Can you afford it?', 'รายได้ต่อเดือน': 'Monthly income',
  'ยอดกู้': 'Loan amount', 'ดอกเบี้ยรวมตลอดสัญญา': 'Total interest over term',
  'ธนาคารทั่วไปให้ภาระผ่อนไม่เกน ~40% ของรายได้ (DSR)': 'Banks typically cap payments at ~40% of income (DSR)',
  // ---- Chat widget ----
  'แชทสอบถาม': 'Ask a question', 'สอบถาม': 'Ask', 'ปิดแชท': 'Close chat',
  'ตอบทันที · ถามได้ทุกเรื่องเกี่ยวกับทรัพย์นี้': 'Instant answers — ask anything about this property',
  'พิมพ์คำถาม...': 'Type your question…', 'ส่ง': 'Send', 'พิมพ์ชื่อของคุณ...': 'Type your name…',
  'เบอร์โทร หรือ LINE ID...': 'Phone or LINE ID…', 'ข้อความเพิ่มเติม หรือพิมพ์ ไม่มี...': 'Extra message, or type \u201cnone\u201d…',
  '📞 ฝากข้อมูลติดต่อ': '📞 Leave contact info', '📞 ฝากข้อมูลอีกครั้ง': '📞 Leave info again',
  '🐶 เลี้ยงสัตว์ได้ไหม': '🐶 Are pets allowed?', '🚉 เดินทางสะดวกไหม': '🚉 Is commuting easy?', '💬 แชร์ LINE': '💬 Share on LINE',
  'ยินดีครับ 🙌 ขอทราบชื่อของคุณก่อนครับ': 'Happy to help! 🙌 May I have your name first?',
  'ส่งข้อความเรียบร้อย รอการติดต่อกลับได้เลยครับ': 'Message sent — we\u2019ll get back to you shortly.',
  // ---- Page titles ----
  'ค้นหาอสังหาริมทรัพย์ — อยู่ใจ (yoojai.com)': 'Search Properties — Yoojai (yoojai.com)',
  'รายการโปรดของฉัน — อยู่ใจ (yoojai.com)': 'My Saved List — Yoojai (yoojai.com)',
  'รายละเอียดประกาศ — อยู่ใจ (yoojai.com)': 'Listing Details — Yoojai (yoojai.com)',
  'อยู่ใจ (yoojai.com) — หาบ้านเช่า บ้านขาย ที่ดิน ครบจบในที่เดียว': 'Yoojai (yoojai.com) — homes for rent, for sale, and land, all in one place'
};

TD.EN_PATTERNS = [
  [/^฿([\d.,]+)\s*ล้าน$/, '฿$1M'],
  [/^ที่ดิน\s*([\d.,]+)\s*ตร\.ว\.$/, 'Land $1 sq.wah'],
  [/^([\d.,]+)\s*ตร\.ม\.$/, '$1 sqm'],
  [/^([\d.,]+)\s*ตร\.ว\.$/, '$1 sq.wah'],
  [/^(\d+)\+\s*ห้องนอน$/, '$1+ Beds'],
  [/^(\d+)\s*ห้องนอน$/, '$1 Bedrooms'],
  [/^(\d+)\s*ห้องน้ำ$/, '$1 Bathrooms'],
  [/^(\d+)\s*นอน$/, '$1 Bed'],
  [/^(\d+)\s*น้ำ$/, '$1 Bath'],
  [/^ชั้น\s*(.+)$/, 'Floor $1'],
  [/^ดูรูปทั้งหมด\s*\((\d+)\)$/, 'View all photos ($1)'],
  [/^\+(\d+)\s*รูป$/, '+$1 photos'],
  [/^รูปที่\s*(\d+)$/, 'Photo $1'],
  [/^\/เดือน$/, '/mo'],
  [/^เปิดดู\s*([\d,]+)\s*ครั้ง$/, '$1 views']
];

TD.tr = function (s) {
  if (Object.prototype.hasOwnProperty.call(this.EN, s)) return this.EN[s];
  for (var i = 0; i < this.EN_PATTERNS.length; i++) {
    if (this.EN_PATTERNS[i][0].test(s)) return s.replace(this.EN_PATTERNS[i][0], this.EN_PATTERNS[i][1]);
  }
  return null;
};
TD.localizeNode = function (node) {
  if (!node) return;
  if (node.nodeType === 3) {
    var raw = node.nodeValue, t = raw.trim();
    if (t) { var en = this.tr(t); if (en != null && en !== t) node.nodeValue = raw.split(t).join(en); }
    return;
  }
  if (node.nodeType !== 1) return;
  /* แปลระดับ element: ถ้ามี data-en ให้ใช้ HTML ที่กำหนดไว้ตรง ๆ (กันปัญหาแปลเป็นชิ้นแล้วติดกัน) */
  if (node.hasAttribute && node.hasAttribute('data-en')) {
    var enHtml = node.getAttribute('data-en');
    if (enHtml && node.innerHTML !== enHtml) node.innerHTML = enHtml;
    return;
  }
  var attrs = ['placeholder', 'title', 'aria-label', 'alt'];
  for (var i = 0; i < attrs.length; i++) {
    if (node.hasAttribute && node.hasAttribute(attrs[i])) {
      var v = (node.getAttribute(attrs[i]) || '').trim(), e2 = this.tr(v);
      if (e2 != null && e2 !== v) node.setAttribute(attrs[i], e2);
    }
  }
  for (var c = node.firstChild; c; c = c.nextSibling) this.localizeNode(c);
};
TD.localize = function (root) { if (this.lang() !== 'en') return; this.localizeNode(root || document.body); };

/* init: apply theme+lang, choose label language, translate + observe */
(function () {
  var de = document.documentElement;
  de.dataset.theme = TD.theme();
  de.lang = TD.lang(); de.dataset.lang = TD.lang();
  TD.catLabel = TD._labels.cat[TD.lang()];
  TD.typeLabel = TD._labels.type[TD.lang()];
  if (TD.lang() === 'en') {
    var et = TD.tr((document.title || '').trim()); if (et) document.title = et;
    var start = function () {
      TD.localize(document.body);
      if ('MutationObserver' in window) {
        TD._obs = new MutationObserver(function (ms) {
          for (var i = 0; i < ms.length; i++) {
            var an = ms[i].addedNodes;
            for (var j = 0; j < an.length; j++) TD.localizeNode(an[j]);
          }
        });
        TD._obs.observe(document.body, { childList: true, subtree: true });
      }
    };
    if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
  }
})();

/* คลิกปุ่มสลับธีม/ภาษา */
if (typeof document !== 'undefined') {
  document.addEventListener('click', function (e) {
    var th = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (th) { e.preventDefault(); TD.toggleTheme(); return; }
    var lg = e.target.closest && e.target.closest('[data-lang-toggle]');
    if (lg) { e.preventDefault(); TD.setLang(TD.lang() === 'en' ? 'th' : 'en'); return; }
  });
}

/* ============ UX: Esc ปิด modal บนสุด + ปุ่มกลับขึ้นบน ============ */
if (typeof document !== 'undefined') {
  // Esc ปิด overlay ที่เปิดอยู่ (ตัวล่าสุดก่อน) — ครอบคลุมทุก modal ในเว็บ
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var overlays = document.querySelectorAll('.ds-ov, .ft-ov, .cc-ov, .yj-modal-ov');
    if (overlays.length) {
      e.preventDefault();
      overlays[overlays.length - 1].remove();
    }
  });

  // ปุ่มกลับขึ้นบนสุด — โผล่เมื่อเลื่อนลงเกิน 600px (ยกเว้นหลังบ้าน/หน้าแผนที่ที่ล็อกสกรอลล์)
  (function () {
    function initToTop() {
      if (document.querySelector('.to-top')) return;
      if (/^\/(admin|map)/.test(location.pathname)) return;
      var b = document.createElement('button');
      b.className = 'to-top'; b.type = 'button'; b.setAttribute('aria-label', 'กลับขึ้นด้านบน');
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
      b.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };
      document.body.appendChild(b);
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          b.classList.toggle('show', window.scrollY > 600);
          ticking = false;
        });
      }, { passive: true });
    }
    if (document.body) initToTop(); else document.addEventListener('DOMContentLoaded', initToTop);
  })();
}
