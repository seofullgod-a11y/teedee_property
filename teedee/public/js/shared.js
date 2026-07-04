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
    translate: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h7"/><path d="M9 3v2c0 4.418 -2.239 8 -5 8"/><path d="M5 9c0 2.144 2.952 3.908 6.7 4"/><path d="M12 20l4 -9l4 9"/><path d="M19.1 18h-6.2"/></svg>'
  },

  brand: { main: 'อยู่', accent: 'ใจ', sub: 'yoojai.com', logo: '' },
  _active: '',

  brandHtml(dark) {
    const b = this.brand;
    const logo = b.logo
      ? `<img class="logo-img" src="${this.esc(b.logo)}" alt="${this.esc(b.main + b.accent)}">`
      : `<span class="mark">${this.icons.home}</span>`;
    return `<a class="brand" ${dark ? 'style="color:#fff"' : ''} href="/">${logo}${this.esc(b.main)}<em>${this.esc(b.accent)}</em>${b.sub ? `<span class="sub-th">${this.esc(b.sub)}</span>` : ''}</a>`;
  },

  chrome(active) {
    this._active = active || '';
    this.renderChrome();
    this.initBrand();
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
      logo: s.logo_url || ''
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
    return `
    <a class="card" href="/listing/${l.id}">
      <div class="thumb">
        ${img ? `<img src="${this.esc(img)}" alt="${this.esc(l.title)}" loading="lazy">` : ''}
        <button class="fav-btn ${faved ? 'on' : ''}" data-fav="${l.id}" type="button" aria-label="บันทึกรายการโปรด">${this.icons.heart}</button>
        <span class="badge-type ${l.listing_type}">${this.icons[this.catIcon[l.category] || 'home']} ${this.typeLabel[l.listing_type] || ''}${this.catLabel[l.category] ? ' · ' + this.catLabel[l.category] : ''}</span>
        <span class="price-tag">
          <span class="p">${this.price(l.price, l.listing_type)}</span>
          ${l.listing_type === 'rent' ? '<span class="per">/เดือน</span>' : ''}
        </span>
      </div>
      <div class="body">
        <h3>${this.esc(l.title)}</h3>
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
        <a href="/#categories">ประเภททั้งหมด</a>
      </nav>
      <span class="nav-spacer"></span>
      <button class="pref-btn" data-theme-toggle type="button" aria-label="สลับโหมดมืด/สว่าง" title="โหมดมืด/สว่าง">${TD.theme() === 'dark' ? this.icons.sun : this.icons.moon}</button>
      <button class="pref-btn" data-lang-toggle type="button" aria-label="Switch language" title="ไทย / English">${this.icons.translate}<span class="lang-code">${TD.lang() === 'en' ? 'ไทย' : 'EN'}</span></button>
      <a class="icon-btn" href="/saved" aria-label="รายการโปรด" title="รายการโปรด">${this.icons.heart}</a>
      <a class="btn btn-ghost btn-sm" href="/#list-cta">ลงประกาศ</a>
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
          <a href="/saved">รายการโปรดของฉัน</a>
          <a href="/#list-cta">ลงประกาศฟรี</a>
          <a href="/admin">เข้าสู่ระบบผู้ดูแล</a>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ${this.esc(this.brand.main + this.brand.accent)} · ${this.esc(this.brand.sub || '')} — All rights reserved</span>
        <span>ทำด้วยใจ เพื่อคนหาบ้าน 🏡</span>
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
  });
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
  'ลงประกาศ': 'List Property', 'รายการโปรด': 'Saved', 'หน้าแรก': 'Home', 'โปรด': 'Saved',
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
  'หา': 'Find', 'ที่ที่ใช่': 'the right place', 'สำหรับชีวิตที่ดี': 'for a better life', 'เริ่มต้นได้ที่นี่': 'starts here',
  'ค้นหาบ้านเช่า คอนโด บ้านขาย และที่ดินจากทั่วประเทศ ข้อมูลครบทุกมิติ ติดต่อเจ้าของได้โดยตรง':
    'Search homes for rent, condos, properties for sale, and land nationwide — complete details, contact owners directly.',
  // ---- Search bar ----
  'ทั้งหมด': 'All', 'ทุกประเภททรัพย์': 'All property types', 'คอนโด': 'Condo', 'บ้านเดี่ยว': 'House',
  'ทาวน์เฮาส์': 'Townhouse', 'ทุกช่วงราคา': 'Any price',
  'เช่า · ไม่เกิน 15,000': 'Rent · up to ฿15,000', 'เช่า · 15,000 – 30,000': 'Rent · ฿15,000–30,000',
  'เช่า · 30,000 – 60,000': 'Rent · ฿30,000–60,000', 'ซื้อ · ไม่เกิน 3 ล้าน': 'Buy · up to ฿3M',
  'ซื้อ · 3 – 6 ล้าน': 'Buy · ฿3M–6M', 'ซื้อ · 6 ล้านขึ้นไป': 'Buy · ฿6M+',
  'ยอดนิยม': 'Popular', 'คอนโดใกล้ BTS': 'Condos near BTS', 'บ้านนครปฐม': 'Houses in Nakhon Pathom',
  'บ้านเช่าเชียงใหม่': 'Rentals in Chiang Mai', 'ที่ดินทั้งหมด': 'All land', 'เลี้ยงสัตว์ได้': 'Pet-friendly',
  // ---- Home sections ----
  'ประกาศแนะนำ': 'Featured Listings', 'คัดมาให้เฉพาะประกาศเด่น ข้อมูลครบ พร้อมติดต่อ': 'Hand-picked standout listings, full details, ready to contact',
  'ดูทั้งหมด': 'View all', 'ดูล่าสุด': 'Recently Viewed', 'ประกาศที่คุณเพิ่งเปิดดู': 'Listings you viewed recently',
  'เลือกดูตามประเภท': 'Browse by Type', 'อยากได้แบบไหน เข้าดูได้ตรงหมวดเลย': 'Jump straight to the category you want',
  'ประกาศมาใหม่': 'New Listings', 'อัปเดตล่าสุดจากเจ้าของทั่วประเทศ': 'The latest updates from owners nationwide',
  'เลือกดูตามจังหวัดที่มีประกาศมากที่สุด': 'Browse the provinces with the most listings',
  'ทำไมต้องอยู่ใจ': 'Why Yoojai', 'เราตั้งใจให้การหาบ้านเป็นเรื่องง่ายและโปร่งใสที่สุด': 'We make finding a home as simple and transparent as possible',
  'มีบ้านหรือที่ดินอยากปล่อยเช่า/ขาย?': 'Have a home or land to rent or sell?',
  'ลงประกาศกับเราฟรี ทีมงานช่วยตรวจสอบข้อมูลและเขียนคอนเทนต์ให้น่าสนใจด้วย AI':
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
