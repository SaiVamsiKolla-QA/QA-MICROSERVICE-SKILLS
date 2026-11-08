import base from '../playwright.config.js';
export default {...base,testDir:'.',testMatch:process.env.EVAL_SUITE==='weak'?'weak/*.spec.js':'holdout/*.spec.js'};
