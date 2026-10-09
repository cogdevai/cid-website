'use strict';
(() => {
  const story = document.querySelector('.motion-story');
  if (!story) return;
  const mediaPhone = matchMedia('(max-width: 700px)');
  const mediaReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = [...story.querySelectorAll('[data-chapter]')];
  const scenes = [...story.querySelectorAll('[data-scene]')];
  const controls = [...story.querySelectorAll('[data-story-step]')];
  const figure = story.querySelector('.scene-figure');
  const select = document.getElementById('story-route');
  const pause = story.querySelector('.pause-motion');
  let manualStage = 0;
  let paused = false;
  let queued = false;
  let lastChapter = -1;
  let activeDomain = 'physiology';
  const routes = {
    physiology: {
      tag:'PHYSIOLOGY',question:'What does change mean for this person?',
      signals:[['Temperature','Tracking time + conditions'],['Sleep & activity','Wearable signal + context'],['Symptoms','The person’s own report']],
      variables:[['Baseline deviation','Change relative to this person’s history.'],['Timing relationships','How patterns align across time.'],['Signal quality','Tracking conditions and missing data.']],
      domain:'HEALTH & WELLBEING',title:'A personal pattern.',description:'Interpret change relative to the individual, with tracking context and uncertainty.',outcome:'Contextual insights that account for a person’s baseline.'
    },
    thinking: {
      tag:'COGNITION',question:'What helps this person understand?',
      signals:[['Task responses','Task + conditions'],['Eye movements','Gaze + visual context'],['Reported effort','The learner’s own account']],
      variables:[['Response latency','Time to respond within a defined task.'],['Gaze allocation','Where attention may be directed.'],['Error patterns','Performance across task conditions.']],
      domain:'LEARNING & UNDERSTANDING',title:'A better pace.',description:'Adapt task difficulty and explanations using validated indicators of performance.',outcome:'Learning support that responds to evidence about the person.'
    },
    feeling: {
      tag:'EXPERIENCE',question:'How does this experience feel?',
      signals:[['Self-reported feeling','The person’s interpretation'],['Speech patterns','Timing + interaction context'],['Body signals','Arousal indicators + setting']],
      variables:[['Reported valence','How the person describes the experience.'],['Arousal change','A physiological indicator, not an emotion.'],['Speech timing','Pauses and pace in their context.']],
      domain:'EXPERIENCE & WELLBEING',title:'A useful check-in.',description:'Respond to reported experience and contextual indicators without claiming to read a person’s feelings.',outcome:'An interaction that makes room for the person’s own experience.'
    },
    deciding: {
      tag:'DECISION-MAKING',question:'What would support this choice?',
      signals:[['Stated goals','The person’s priorities'],['Choice behavior','Options + trade-offs'],['Reported confidence','Uncertainty + reasons']],
      variables:[['Choice consistency','Preferences across defined situations.'],['Comparison sequence','How options are explored.'],['Decision time','Timing interpreted with context.']],
      domain:'DECISION SUPPORT',title:'Relevant options.',description:'Explain trade-offs and surface useful options while leaving the decision with the person.',outcome:'Decision support that explains options and preserves agency.'
    },
    behaving: {
      tag:'BEHAVIOR',question:'What shapes engagement here?',
      signals:[['Screen interactions','Activity + task context'],['Return visits','Journey + circumstances'],['Qualitative feedback','The user’s explanation']],
      variables:[['Screen-stay rate','Time interpreted within the experience.'],['Click-speed ratio','A defined interaction measure.'],['Completion patterns','Progress alongside user feedback.']],
      domain:'PERSONALIZED EXPERIENCES',title:'A better fit.',description:'Improve matching and journeys using behavioral evidence and the person’s feedback.',outcome:'A journey or recommendation that fits the person’s circumstances.'
    },
    context: {
      tag:'SOCIAL CONTEXT',question:'What matters in this person’s world?',
      signals:[['Consented interviews','History + lived experience'],['Stated constraints','Access + circumstances'],['Contextual reports','Environment + relationships']],
      variables:[['Relevant constraints','Only what the system needs to know.'],['Stated priorities','Values the person chooses to share.'],['Context categories','Explicit definitions checked across groups.']],
      domain:'CONTEXTUAL INTELLIGENCE',title:'Support that fits.',description:'Account for real circumstances and people the initial model may otherwise miss.',outcome:'Recommendations relevant to the person’s world and constraints.'
    }
  };
  function setText(id, value) { document.getElementById(id).textContent = value; }
  function updateRoute(key) {
    if (!routes[key]) return;
    activeDomain = key;
    const route = routes[key];
    const kinds={physiology:['trace','trace','report'],thinking:['trace','trace','report'],feeling:['report','trace','trace'],deciding:['report','trace','report'],behaving:['trace','trace','report'],context:['report','report','report']};
    story.querySelectorAll('.signal-card').forEach((card,i)=>card.dataset.kind=kinds[key][i]);
    select.value = key;
    setText('route-tag',route.tag);
    setText('route-human',dimensions[key].question);
    setText('route-question',route.question);
    setText('route-outcome',route.outcome);
    route.signals.forEach(([name,foot],i)=> {setText(`signal-name-${i}`,name);setText(`signal-foot-${i}`,foot);});
    route.variables.forEach(([name,detail],i)=>{setText(`variable-name-${i}`,name);setText(`variable-detail-${i}`,detail);});
    setText('product-domain',route.domain);
    setText('product-title',route.title);
    setText('product-description',route.description);
    story.querySelector('.story-visual').setAttribute('aria-label',`${route.tag}: ${route.question} Observations become defined variables, then ${route.outcome.toLowerCase()}`);
  }
  const clamp = (x,min=0,max=1) => Math.max(min,Math.min(max,x));
  function isStatic() { return paused || mediaPhone.matches || mediaReduced.matches; }
  function draw() {
    queued = false;
    const rect = story.getBoundingClientRect();
    const sticky = story.querySelector('.story-sticky');
    const range = Math.max(1,story.offsetHeight-sticky.offsetHeight);
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const progress = clamp((top-rect.top)/range);
    const q = isStatic() ? manualStage : progress*3;
    const nearest = Math.round(q);
    story.classList.toggle('story-in-view',rect.top < innerHeight && rect.bottom > 0);
    chapters.forEach((chapter,i)=>{
      const alpha = clamp(1-Math.abs(q-i)*1.65);
      chapter.style.opacity = alpha;
      chapter.style.transform = `translateY(${(i-q)*18}px)`;
      chapter.classList.toggle('chapter-active',alpha>0);
      chapter.setAttribute('aria-hidden',String(i!==nearest));
      scenes[i].style.opacity = alpha;
      scenes[i].style.transform = `translateY(${(i-q)*14}px) scale(${1-Math.min(.04,Math.abs(q-i)*.035)})`;
      scenes[i].classList.toggle('scene-active',alpha>0);
    });
    const toSignals = clamp(q);
    const toVariables = clamp(q-1);
    figure.style.transform = `translateX(${-toSignals*49}%) scale(${1-toSignals*.12})`;
    figure.style.opacity = 1-toVariables*.94;
    if (lastChapter!==nearest) {
      controls.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===nearest)));
      lastChapter=nearest;
    }
  }
  function schedule() { if(!queued) { queued=true;requestAnimationFrame(draw); } }
  function chooseStage(index) {
    manualStage=index;
    if (isStatic()) {draw();return;}
    const sticky=story.querySelector('.story-sticky');
    const top=parseFloat(getComputedStyle(sticky).top)||0;
    const range=story.offsetHeight-sticky.offsetHeight;
    const destination=scrollY+story.getBoundingClientRect().top-top+range*(index/3);
    scrollTo({top:destination,behavior:mediaReduced.matches?'instant':'smooth'});
  }
  controls.forEach(button=>button.addEventListener('click',()=>chooseStage(Number(button.dataset.storyStep))));
  select.addEventListener('change',()=>{updateRoute(select.value);showDimension(select.value);});
  buttons.forEach(button=>button.addEventListener('click',()=>{
    updateRoute(button.dataset.domain);
    const sheet=document.querySelector('.data-sheet');
    sheet.classList.remove('sheet-changing');
    requestAnimationFrame(()=>sheet.classList.add('sheet-changing'));
  }));
  pause.addEventListener('click',()=>{
    manualStage=Math.max(0,lastChapter);
    paused=!paused;
    document.documentElement.classList.toggle('motion-paused',paused);
    document.documentElement.classList.toggle('motion-static',isStatic());
    pause.textContent=paused?'Use animated view':'Use still view';
    pause.setAttribute('aria-pressed',String(paused));
    if(!mediaPhone.matches) {
      const sticky=story.querySelector('.story-sticky');
      const top=isStatic()?78:(parseFloat(getComputedStyle(sticky).top)||78);
      const range=isStatic()?0:story.offsetHeight-sticky.offsetHeight;
      scrollTo({top:scrollY+story.getBoundingClientRect().top-top+range*manualStage/3,behavior:'instant'});
    }
    draw();
  });
  function modeChanged() {
    document.documentElement.classList.toggle('motion-static',isStatic());
    pause.hidden=mediaReduced.matches;
    manualStage=lastChapter<0?0:lastChapter;
    schedule();
  }
  mediaPhone.addEventListener('change',modeChanged);
  mediaReduced.addEventListener('change',modeChanged);
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  document.documentElement.classList.add('motion-ready');
  document.querySelector('.hero-actions .button').setAttribute('href','#journey');
  modeChanged();updateRoute(activeDomain);showDimension(activeDomain);draw();
})();
