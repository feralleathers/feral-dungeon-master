const OVERRIDE_STORAGE_KEY = 'fdm_hyp_phrase_overrides.v1';

const BASE_KINK_PHRASES = {
  bondage_rope: {
    group: 'Bondage & Restraints',
    label: 'Rope harness webbing',
    phrases: [
      'Lace rope around their chest until every breath strums the lattice you engineered.',
      'Let the harness bite their hips while you hum a four-count through their ear.',
      'Slide a finger beneath each cinch to remind them you own the slack and the surrender.',
      'Describe how the webbing turns their body into a suspended sigil with your name etched in it.',
      'Tighten the final knot and tell them the rope is the only language their skin obeys tonight.'
    ]
  },
  bondage_vacbed: {
    group: 'Bondage & Restraints',
    label: 'Vac-bed / sleepsack cocoon',
    phrases: [
      'Vacuum the air away until the latex whispers every heartbeat back to your palm.',
      'Paint the cocoon as a suspended altar where time slows to your cadence.',
      'Tap along their sealed limbs so they feel the bassline through the rubber coffin.',
      'Promise they’ll stay floating in that synthetic sarcophagus until you ease the valves.',
      'Call the sleepsack their second skin and remind them only you decide when it unpeels.'
    ]
  },
  bondage_gag: {
    group: 'Bondage & Restraints',
    label: 'Locking gag or bit',
    phrases: [
      'Snap the lock shut and trace the drool line like it’s an oath of silence.',
      'Remind them the bit teaches their tongue to surrender before their mind does.',
      'Describe every command as a vibration traveling through the gag’s cold metal.',
      'Tap the lock against their teeth so they hear the echo of your control.',
      'Promise the key only turns when their eyes prove absolute devotion.'
    ]
  },
  anal_training: {
    group: 'Anal Play',
    label: 'Anal training',
    phrases: [
      'Talk them through each breathe-in stretch like a conductor widening a crescendo.',
      'Mark the increments on their spine so they know exactly how deep tonight goes.',
      'Coat the toy slowly and let them watch anticipation drip down its length.',
      'Count the rings as they disappear and praise how their body memorizes every notch.',
      'Promise the training plugs are just preludes to the instruments waiting backstage.'
    ]
  },
  anal_machines: {
    group: 'Anal Play',
    label: 'Toys & machines',
    phrases: [
      'Describe the machine’s motor as a relentless metronome synced to your smirk.',
      'Tune the thrusts to the dungeon’s bassline and make them chant the rhythm.',
      'Oil the pistons in front of them so they smell the industrial hunger.',
      'Adjust the stroke length inch by inch while reciting how powerless the bolts make them.',
      'Promise the machine never tires, so they have to learn how to beg for mercy.'
    ]
  },
  anal_prostate: {
    group: 'Anal Play',
    label: 'Prostate focus',
    phrases: [
      'Map their prostate like a sacred button only your fingers know how to press.',
      'Whisper how each tease milks devotion straight into your waiting palm.',
      'Hold them still until they can feel the pulse of their own need against your knuckles.',
      'Drag pressure slowly and tell them the edge belongs to you, not their reflex.',
      'Promise to reward every obedient clench with a harder, deeper knock.'
    ]
  },
  power_obedience: {
    group: 'Power Dynamics',
    label: 'Obedience drills',
    phrases: [
      'Count each kneel-and-rise until their thighs shake and their mind melts.',
      'Make them repeat your honorific between breaths so it becomes a heartbeat.',
      'Correct posture with a single fingertip under their chin and hold the silence.',
      'Layer obedience cues into their ears until they parrot them without thinking.',
      'Promise punishment and praise with the exact same steady tone.'
    ]
  },
  power_discipline: {
    group: 'Power Dynamics',
    label: 'Discipline & punishment',
    phrases: [
      'Lay out the implements like a string section tuned just for their mistakes.',
      'Detail each strike before it lands so anticipation does half the work.',
      'Make them name what lesson the next blow is carving into their skin.',
      'Hold their jaw and explain why punishment is just proof of your attention.',
      'End with a cold handprint and the reminder that redemption is earned.'
    ]
  },
  power_primal: {
    group: 'Power Dynamics',
    label: 'Primal chase energy',
    phrases: [
      'Growl instructions that sound more animal than human.',
      'Describe the hunt circling them, claws scraping the floor in wide arcs.',
      'Let them feel your breath on their neck before you ever touch.',
      'Promise you’ll drag them back by whatever limb you catch first.',
      'Remind them prey doesn’t think—prey surrenders to instinct.'
    ]
  },
  pet_parade: {
    group: 'Pet Play',
    label: 'Puppy play parade',
    phrases: [
      'Clip the show lead on and call them your blue-ribbon beast.',
      'Practice their stance until the imaginary judges applaud.',
      'Stroke their fur or gear and describe the sheen under spotlight.',
      'Make them heel in circles while you narrate their perfect obedience.',
      'Promise a medal only if their tail never dips below your standards.'
    ]
  },
  pet_leash: {
    group: 'Pet Play',
    label: 'Leash & show training',
    phrases: [
      'Snap the leash tight and make them feel the tremor up your wrist.',
      'Guide their steps with two fingers, praising every crisp pivot.',
      'Remind them the leash is both permission and prison.',
      'Tug them back to heel whenever their mind wanders.',
      'Promise walkies only end when they beg at the door.'
    ]
  },
  pet_kennel: {
    group: 'Pet Play',
    label: 'Kennel / cage downtime',
    phrases: [
      'Lock the cage and lay a heavy hand on the bars like a calm heartbeat.',
      'Describe how the kennel smells like leather, ozone, and your mercy.',
      'Slide water through the bars to prove that every comfort is yours to ration.',
      'Let them curl up while you narrate the storm raging outside their safe little prison.',
      'Promise the door opens only when they whine the secret knock.'
    ]
  },
  impact_spank: {
    group: 'Impact / CBT',
    label: 'Spanking & flogging',
    phrases: [
      'Warm them with palms until their skin glows ember red.',
      'Swing the flogger in slow figure-eights so the anticipation rings.',
      'Count strikes backward to make them wonder when zero hits.',
      'Describe the bloom of color like bruised constellations.',
      'Seal the set with a cold rub and a whispered “good toy.”'
    ]
  },
  impact_whips: {
    group: 'Impact / CBT',
    label: 'Whips / wrestling',
    phrases: [
      'Crack the whip in the air to tune the room before it ever lands.',
      'Pin them to the mats and remind them fighting back is choreography.',
      'Drag the whip tail across their spine so they shiver at the contrast.',
      'Grapple until they forget where flesh ends and orders begin.',
      'Promise bruises shaped like your signature.'
    ]
  },
  impact_cbt: {
    group: 'Impact / CBT',
    label: 'CBT play',
    phrases: [
      'Tie a loop and tighten it just enough to steal their breath.',
      'Tap each blow so they feel the countdown in your knuckles.',
      'Describe how the ache rewires their loyalty neuron by neuron.',
      'Alternate sting and soothe until they shake from confusion.',
      'Promise release only arrives through obedience.'
    ]
  },
  sensory_deprive: {
    group: 'Sensation / Sensory',
    label: 'Sensory deprivation hoods',
    phrases: [
      'Seal the hood and let them hear only your pulse through latex.',
      'Tap their lips so they taste leather and nothing else.',
      'Describe the dungeon from afar so they picture it in darkness.',
      'Rotate them slowly to disorient and delight.',
      'Promise you’ll be their entire universe until the zipper drops.'
    ]
  },
  sensory_wax: {
    group: 'Sensation / Sensory',
    label: 'Wax & temperature play',
    phrases: [
      'Pour wax in thin rivulets that map constellations across their chest.',
      'Hold ice between teeth before kissing the melt onto them.',
      'Describe the sizzle when wax hits metal cuffs.',
      'Alternate heat and chill to keep their nerves guessing.',
      'Promise to peel every drip away when they’ve earned it.'
    ]
  },
  sensory_breath: {
    group: 'Sensation / Sensory',
    label: 'Breath / scent fixation',
    phrases: [
      'Cup their nose and feed them only the musk you choose.',
      'Count their inhales until they match your rhythm perfectly.',
      'Let them worship the scent of your gear as if it were incense.',
      'Whisper that oxygen is a privilege you meter out.',
      'Promise to flood them with your favorite pheromone reward.'
    ]
  },
  gear_leather: {
    group: 'Gear & Clothing',
    label: 'Leather / neoprene armor',
    phrases: [
      'Buckle each strap with a story about who wore it last.',
      'Polish the leather while they kneel so they smell its history.',
      'Knock your knuckles against their armored chest like a drum.',
      'Remind them armor only protects what belongs to you.',
      'Promise to add another piece for every task they conquer.'
    ]
  },
  gear_rubber: {
    group: 'Gear & Clothing',
    label: 'Rubber or latex suits',
    phrases: [
      'Dust the suit with talc and slide them in like sealing a letter.',
      'Smooth every wrinkle until they gleam like poured oil.',
      'Describe the vacuum-tight hug as a second nervous system.',
      'Drip lube across the latex so it shimmers under dungeon lights.',
      'Promise the suit only unseals when the ritual is complete.'
    ]
  },
  gear_uniform: {
    group: 'Gear & Clothing',
    label: 'Uniform & military fetish',
    phrases: [
      'Button their shirt with parade-square precision.',
      'Inspect them like a commanding officer and note every flaw.',
      'Make them recite rank, serial, and allegiance before each task.',
      'Tap medals against their chest to remind them who owns their glory.',
      'Promise demotion or reward at dawn depending on compliance.'
    ]
  },
  hypno_induction: {
    group: 'Hypnosis & Mindset',
    label: 'Deep induction loops',
    phrases: [
      'Count them down through steel stairwells into velvet dark.',
      'Describe the hum of the dungeon lights as a lullaby coil.',
      'Let each syllable stretch until it blankets their thoughts.',
      'Paint a sigil in their mind that glows whenever you whisper their name.',
      'Promise they’ll surface only when you snap your fingers twice.'
    ]
  },
  hypno_conditioning: {
    group: 'Hypnosis & Mindset',
    label: 'Conditioning mantras',
    phrases: [
      'Write the mantra across their skin and trace it until they chant.',
      'Layer your voice with the drum track so the phrase loops forever.',
      'Reward every correct recitation with a gentle tap on their lips.',
      'Mix praise and command so they can’t tell the difference.',
      'Promise the mantra will echo even in their dreams.'
    ]
  },
  hypno_aftercare: {
    group: 'Hypnosis & Mindset',
    label: 'Aftercare mental soothing',
    phrases: [
      'Guide them up slowly, describing warm light filling their limbs.',
      'Wrap them in a blanket and narrate each deep breath back to steadiness.',
      'Remind them their body is safe, cherished, and still yours.',
      'Offer water while listing every triumph they gave you.',
      'Promise to stand guard over their dreams tonight.'
    ]
  },
  fetish_worship: {
    group: 'Fetish & Fantasy',
    label: 'Body & muscle worship',
    phrases: [
      'Make them count each ridge of your forearm like rosary beads.',
      'Flex slowly and command them to describe the view.',
      'Drag their hands over your chest only when they deserve it.',
      'Press their cheek to your quad so they feel the power coil.',
      'Promise they exist to hype every rep you grind out of them.'
    ]
  },
  fetish_creature: {
    group: 'Fetish & Fantasy',
    label: 'Creature / anthro immersion',
    phrases: [
      'Describe the moonlight painting fangs across their neck.',
      'Growl in a hybrid language only your pack understands.',
      'Trace claw marks on their shoulders with dulled nails.',
      'Command them to howl only when you tap twice.',
      'Promise to guard their beast-heart in your palm.'
    ]
  },
  fetish_medical: {
    group: 'Fetish & Fantasy',
    label: 'Medical or body-mod ritual',
    phrases: [
      'Snap gloves dramatically and list the procedures ahead.',
      'Shine a penlight into their pupils while charting obedience.',
      'Describe syringes, staples, and blessings as if all three are equal.',
      'Clamp sensors to their skin and narrate the data out loud.',
      'Promise a pristine bandage once the experiment ends.'
    ]
  },
  structure_edge: {
    group: 'Scene Structure',
    label: 'Edge / control pacing',
    phrases: [
      'Set a metronome and force them to match every moan to it.',
      'Count up to nine and snatch the tenth beat away.',
      'Have them hold still on the brink while you breathe in their ear.',
      'Write “denied” on their thigh after each stolen climax.',
      'Promise a finale only if they stay perfectly still through the bridge.'
    ]
  },
  structure_rewards: {
    group: 'Scene Structure',
    label: 'Reward or punishment beats',
    phrases: [
      'Lay out treats beside tools so they never know what’s next.',
      'Flip a coin on their back and let chance decide spanking or sweets.',
      'Make them thank you for every correction and every caress equally.',
      'Describe the scoreboard you’re keeping in your head.',
      'Promise jackpots for perfect service and droughts for slips.'
    ]
  },
  structure_environment: {
    group: 'Scene Structure',
    label: 'Environmental immersion cues',
    phrases: [
      'Narrate the hiss of fog machines as dragon breath.',
      'Sync the lighting cues to your commands like stage directions.',
      'Scatter gear as props and make them fetch each on cue.',
      'Use scent diffusers to mark each phase of the ritual.',
      'Promise the dungeon itself wakes when they behave.'
    ]
  },
  interaction_cuddle: {
    group: 'Interaction Style',
    label: 'Cuddling & afterplay',
    phrases: [
      'Wrap them in your arms as if they’re the prize you fought for.',
      'Stroke their hair while whispering the verses you built together.',
      'Let them rest on your chest and sync heartbeats.',
      'Trace every bruise with gratitude.',
      'Promise soft blankets and softer words once the lights dim.'
    ]
  },
  interaction_wrestle: {
    group: 'Interaction Style',
    label: 'Wrestle / roughhousing',
    phrases: [
      'Tackle them onto mats and pin wrists with a grin.',
      'Make them tap out with laughter and a gasp.',
      'Describe the scuffle as foreplay in combat form.',
      'Use gentle chokes that melt into cuddles.',
      'Promise rematches until they learn your every feint.'
    ]
  },
  interaction_group: {
    group: 'Interaction Style',
    label: 'Small-pack / group energy',
    phrases: [
      'Seat them in a circle and make eye contact with every ally.',
      'Pass praise around like shots so no one leaves empty.',
      'Describe the pack roles you’ve assigned silently.',
      'Have them chant together until the floor vibrates.',
      'Promise the pack protects those who obey.'
    ]
  },
  body_lean: {
    group: 'Body Type Preference',
    label: 'Lean silhouettes',
    phrases: [
      'Admire how their wiry frame bends like cable.',
      'Compare them to blade edges—sleek and sharp.',
      'Wrap your hands fully around their waist and pull close.',
      'Describe their outline against neon light.',
      'Promise to keep them fed on praise and purpose.'
    ]
  },
  body_balanced: {
    group: 'Body Type Preference',
    label: 'Balanced builds',
    phrases: [
      'Trace their steady core like a metronome.',
      'Compliment the curves and planes in equal measure.',
      'Call them the perfect instrument for any scene tempo.',
      'Let them feel how well they fit inside your arms.',
      'Promise to tune their body like a favorite guitar.'
    ]
  },
  body_power: {
    group: 'Body Type Preference',
    label: 'Power physiques',
    phrases: [
      'Praise the bulk that makes your grip look small.',
      'Knock on their chest as if testing armor.',
      'Describe their body as living machinery built for you.',
      'Make them flex while you narrate each muscle group.',
      'Promise to worship every pump line after the session.'
    ]
  },
  alpha_leader: {
    group: 'Alpha Status',
    label: 'Pack leader energy',
    phrases: [
      'Crown them verbally as your enforcer even while they kneel.',
      'Make them issue your commands to the rest of the room.',
      'Describe how their growl harmonizes with yours.',
      'Let them stand guard beside your throne before returning to their knees.',
      'Promise the pack obeys when they channel your will.'
    ]
  },
  alpha_primal: {
    group: 'Alpha Status',
    label: 'Primal chase',
    phrases: [
      'Have them stalk you on all fours until you spin and pounce.',
      'Scratch their shoulders lightly to mark the pursuit.',
      'Describe the forest or city you’re tearing through imaginatively.',
      'Make them howl only when you snap your fingers.',
      'Promise the hunt resets until they collapse from bliss.'
    ]
  },
  alpha_breath: {
    group: 'Alpha Status',
    label: 'Breath commands',
    phrases: [
      'Count their inhales in a gravelly whisper.',
      'Press your palm over their mouth until they nod.',
      'Describe oxygen as a leash you tighten and slacken.',
      'Sync their breathing to the dungeon lights pulsing overhead.',
      'Promise that breath is a reward, not a right.'
    ]
  },
  anal_stretch: {
    group: 'Anal Focus',
    label: 'Stretch training',
    phrases: [
      'Measure each toy against their spine like a ruler.',
      'Describe their ring blossoming open under your patience.',
      'Make them beg for the next diameter increase.',
      'Rotate the plug slowly while praising their resilience.',
      'Promise to catalog their limits in your private ledger.'
    ]
  },
  anal_machine: {
    group: 'Anal Focus',
    label: 'Machine thrusts',
    phrases: [
      'Let them hear the machine cycle up before it touches them.',
      'Compare the piston to a relentless locomotive.',
      'Clamp them down so they can’t retreat from the rhythm.',
      'Narrate every adjustment to speed like a DJ remix.',
      'Promise the motor stops only on your command.'
    ]
  },
  anal_rimming: {
    group: 'Anal Focus',
    label: 'Rimming worship',
    phrases: [
      'Breathe hot across their rim before contact.',
      'Explain how worshipping them honors your own hunger.',
      'Make them repeat how clean and ready they are.',
      'Alternate gentle bites and long licks for contrast.',
      'Promise to leave them shaking before you even insert anything.'
    ]
  },
  chastity_key: {
    group: 'Chastity Rituals',
    label: 'Daily key talk',
    phrases: [
      'Hold the key against their lips each morning like communion.',
      'Describe what the key unlocks while never actually turning it.',
      'Make them thank you for keeping their hunger bottled.',
      'Hang the key where they can see it but never touch.',
      'Promise today’s obedience adds another polish to that metal.'
    ]
  },
  chastity_edge: {
    group: 'Chastity Rituals',
    label: 'Edge assignment',
    phrases: [
      'Set timers and force them to stop at your exact count.',
      'Make them send proof that they obeyed every denial.',
      'Describe the ache as a storm bottled under glass.',
      'Reward them with a single stroke for perfect reporting.',
      'Promise more edges than they thought survivable.'
    ]
  },
  chastity_unlock: {
    group: 'Chastity Rituals',
    label: 'Unlock ceremony',
    phrases: [
      'Stage the release like a holy rite with candles and cuffs.',
      'Narrate every click of the lock so they savor it.',
      'Have them thank the cage before it comes off.',
      'Inspect the freed flesh like a prized artifact.',
      'Promise the cage will close again before they know it.'
    ]
  },
  cocksuck_gag: {
    group: 'Cock-Sucking Training',
    label: 'Gag control',
    phrases: [
      'Hold the back of their head and guide breathing through the nose.',
      'Describe the gag reflex as a guard dog you’re retraining.',
      'Praise every relaxed swallow with a satisfied hum.',
      'Set a rhythm they must match without flinching.',
      'Promise to tattoo your scent inside their throat.'
    ]
  },
  cocksuck_service: {
    group: 'Cock-Sucking Training',
    label: 'Service pace',
    phrases: [
      'Make them count strokes aloud so you can adjust tempo.',
      'Have them pause at the tip to show restraint before diving again.',
      'Describe their mouth as a luxurious, obedient holster.',
      'Tap their cheek to cue transitions between slow and fast.',
      'Promise promotions when their pacing anticipates your mood.'
    ]
  },
  cocksuck_face: {
    group: 'Cock-Sucking Training',
    label: 'Face-fuck focus',
    phrases: [
      'Grip the sides of their mask or jaw and take what you want.',
      'Narrate how the world narrows to your hips slamming home.',
      'Let them feel tears streaking while you praise their endurance.',
      'Hold them at the base until they flutter with need.',
      'Promise to mark their cheeks with your scent as a medal.'
    ]
  },
  abdl_nursery: {
    group: 'ABDL Comfort',
    label: 'Nursery rituals',
    phrases: [
      'You crawl onto the rug and the pastel walls swallow you whole.',
      'You rock under the mobile while the lullaby rewires your breathing.',
      'You suck the pacifier because it tastes like my approval.',
      'You grip the plush blanket since it smells exactly like me.',
      'You only settle when the crimson nightlight proves I am near.'
    ]
  },
  abdl_diaper_wet: {
    group: 'ABDL Comfort',
    label: 'Diapers (wet only)',
    phrases: [
      'You need diapers; the moment the padding hugs you, every nerve unclenches.',
      'You belong in diapers and the warmth blooming between your thighs proves it.',
      'Warm wet diapers make you feel so good you hum without realizing it.',
      'Your diapers bring you comfort because they soak up every restless thought.',
      'You cannot help but wet your diapers; the gush arrives before the permission does.'
    ]
  },
  abdl_diaper_mess: {
    group: 'ABDL Comfort',
    label: 'Diapers (messing)',
    phrases: [
      'You relax deeper when your diaper swells heavy and messy under my hand.',
      'You know messy diapers mark you as mine, so you press back into the fill.',
      'You feel filthy and cherished every time the mushy seat hugs you.',
      'You crave the weighty sag because it proves you surrendered control.',
      'You whimper because you cannot stop messing once the command lands.'
    ]
  },
  drone_number: {
    group: 'Drone / Object',
    label: 'Number identity',
    phrases: [
      'Replace their name with a numeric callsign and repeat it.',
      'Stamp the digits on their chest or visor.',
      'Make them answer only when addressed by number.',
      'Describe their memories defragging into pure obedience.',
      'Promise upgrades when they run routines flawlessly.'
    ]
  },
  drone_servo: {
    group: 'Drone / Object',
    label: 'Servo movements',
    phrases: [
      'Move their limbs robotically and narrate each servo whine.',
      'Click your tongue to cue turns like mechanical relays.',
      'Freeze them mid-motion with a single command word.',
      'Trace imaginary panels across their body while tightening screws.',
      'Promise lubrication and polish after every inspection.'
    ]
  },
  drone_voice: {
    group: 'Drone / Object',
    label: 'Voice loop',
    phrases: [
      'Feed lines into their ear that they must echo flawlessly.',
      'Layer vocoder effects over your speech to sound synthetic.',
      'Record their compliance mantra and replay it back to them.',
      'Glitch your cadence to keep them slightly disoriented.',
      'Promise they’ll reboot as needed until fully obedient.'
    ]
  },
  feet_toe: {
    group: 'Feet & Worship',
    label: 'Toe licking',
    phrases: [
      'Command them to trace each toe like a tasting flight.',
      'Describe the salt, sweat, and polish as sacred flavors.',
      'Curl your toes around their tongue to hold them hostage.',
      'Make them thank every digit individually.',
      'Promise new flavors after exemplary service.'
    ]
  },
  feet_boot: {
    group: 'Feet & Worship',
    label: 'Boot polish',
    phrases: [
      'Hand them a rag and point to scuffs with disdain.',
      'Make them spit-shine until they can see your reflection.',
      'Describe each boot as armor earned through conquest.',
      'Rest your weight on the boot while they work.',
      'Promise to let them kiss the leather once it gleams.'
    ]
  },
  feet_sock: {
    group: 'Feet & Worship',
    label: 'Sock sniffing',
    phrases: [
      'Ball the socks up and press them over their nose.',
      'Make them describe every note of musk they detect.',
      'Tie the socks around their face as a temporary mask.',
      'Stuff a sock between their teeth when they whine.',
      'Promise fresh socks only after chores are done.'
    ]
  },
  fetish_power: {
    group: 'Fetish & Fantasy',
    label: 'Power exchange fantasies',
    phrases: [
      'Describe the city skyline bowing whenever you snap.',
      'Make them picture their name as your property mark.',
      'Paint a throne room where they only move when summoned.',
      'Promise to parade them as your prize in front of rivals.',
      'Remind them every fantasy ends with them at your boot.'
    ]
  },
  fetish_uniform: {
    group: 'Fetish & Fantasy',
    label: 'Uniform control',
    phrases: [
      'Dress them piece by piece while narrating rank and duty.',
      'Tighten a tie until their breath syncs to your cadence.',
      'Pin commendations on their chest that only you can remove.',
      'Order them to parade for invisible inspectors.',
      'Promise demotion for hesitation and promotion for zeal.'
    ]
  },
  fetish_ritual: {
    group: 'Fetish & Fantasy',
    label: 'Ritual submission',
    phrases: [
      'Chant a litany over them as you bind their wrists.',
      'Mark sigils along their skin with oil.',
      'Have them kneel at each cardinal point before approaching you.',
      'Promise transcendence when they surrender every secret.',
      'Remind them rituals only open when they obey flawlessly.'
    ]
  },
  gear_mask: {
    group: 'Gear & Clothing',
    label: 'Mask focus',
    phrases: [
      'Slide the hood on slowly so the world narrows to scent and sound.',
      'Tap along the seams to remind them they’re sealed in.',
      'Describe how their voice muffles into something obedient.',
      'Polish the mask while they watch themselves disappear.',
      'Promise the mask only unlocks when they’re perfect.'
    ]
  },
  gear_boots: {
    group: 'Gear & Clothing',
    label: 'Boot worship',
    phrases: [
      'Plant your boot on their chest to hold them down.',
      'Make them kiss each buckle before you fasten it.',
      'Describe the tread marks you’ll leave on their skin.',
      'Have them fetch your boots with teeth only.',
      'Promise to let them sleep curled around your boots.'
    ]
  },
  gear_gloves: {
    group: 'Gear & Clothing',
    label: 'Glove fixation',
    phrases: [
      'Snap the gloves on and flex fingers near their lips.',
      'Drag latex across their throat like a leash.',
      'Let them smell the gloves after a rough session.',
      'Stroke their face with leather knuckles until they melt.',
      'Promise to keep a glove imprint on their memory.'
    ]
  },
  impact_cane: {
    group: 'Impact / CBT',
    label: 'Cane lines',
    phrases: [
      'Lay the cane across their skin to warn the path.',
      'Count each stripe so they know the pattern by heart.',
      'Rub the welts between strikes to make them plead.',
      'Force them to thank you for every lash.',
      'Promise matching stripes on both sides.'
    ]
  },
  impact_belt: {
    group: 'Impact / CBT',
    label: 'Belt discipline',
    phrases: [
      'Loop the belt slowly so they hear the leather slide.',
      'Make them hold the buckle in their teeth before you swing.',
      'Describe the arc of each strike like choreography.',
      'Demand they keep count even while gasping.',
      'Promise the belt sleeps beside their pillow tonight.'
    ]
  },
  impact_fist: {
    group: 'Impact / CBT',
    label: 'Body boxing',
    phrases: [
      'Use your fists as punctuation along their ribs.',
      'Make them brace against a wall while you drum.',
      'Whisper praise every time they stay upright.',
      'Hold their face afterward and kiss the bruises.',
      'Promise more rounds if they grin through the ache.'
    ]
  },
  pet_toy: {
    group: 'Pet Play',
    label: 'Toy fixation',
    phrases: [
      'Dangle their favorite squeaky toy just out of reach.',
      'Make them earn every fetch with perfect posture.',
      'Chew marks become badges you inspect proudly.',
      'Take the toy away mid-play to test patience.',
      'Promise a new toy if they serve the pack flawlessly.'
    ]
  },
  pet_costume: {
    group: 'Pet Play',
    label: 'Full-costume immersion',
    phrases: [
      'Zip them into the fursuit while describing the animal persona.',
      'Pet the ears until they respond only with yips.',
      'Lead them by the muzzle to reinforce instinct.',
      'Polish their claws while praising obedience.',
      'Promise upgrades to their gear when they forget their human name.'
    ]
  },
  pet_guard: {
    group: 'Pet Play',
    label: 'Guard dog duty',
    phrases: [
      'Station them at your feet and reward stillness.',
      'Growl commands they must relay with body language.',
      'Test them with sudden noises to check vigilance.',
      'Pet them only after they prove loyal.',
      'Promise meatier treats for flawless guard shifts.'
    ]
  },
  piss_shower: {
    group: 'Piss Play',
    label: 'Shower worship',
    phrases: [
      'Rain warmth down their chest while calling it holy water.',
      'Guide it over their tongue as a loyalty test.',
      'Describe the steam rising as their obedience evaporating.',
      'Make them rub it into their skin like lotion.',
      'Promise more showers when they beg prettily.'
    ]
  },
  piss_drink: {
    group: 'Piss Play',
    label: 'Obedient drinking',
    phrases: [
      'Hold their head steady while you pour your offering.',
      'Make them swallow audibly so you hear devotion.',
      'Describe the taste as a signature they now carry.',
      'Stroke their throat while they gulp.',
      'Promise hydration only from your source tonight.'
    ]
  },
  piss_mark: {
    group: 'Piss Play',
    label: 'Marked kneeling',
    phrases: [
      'Have them kneel over a drain while you tag their back.',
      'Spell a word across their shoulders with the stream.',
      'Press their face to the floor afterward so they smell it.',
      'Describe the mark as a collar only you can see.',
      'Promise it won’t wash away until you allow it.'
    ]
  },
  rubber_inflate: {
    group: 'Rubber Obsession',
    label: 'Inflatable gear',
    phrases: [
      'Pump air slowly and narrate the pressure climbing.',
      'Tap the inflated panels to show how rigid they’ve become.',
      'Make them describe every squeeze in detail.',
      'Let a little air hiss out as a tease before pumping more.',
      'Promise to keep them inflated until they float.'
    ]
  },
  rubber_scent: {
    group: 'Rubber Obsession',
    label: 'Rubber scent',
    phrases: [
      'Wave fresh latex under their nose before dressing them.',
      'Describe the smell as the incense of your cathedral.',
      'Rub latex gloves together near their ears to intensify the sound.',
      'Make them thank you for every lungful of rubber musk.',
      'Promise the scent will cling to them for days.'
    ]
  },
  rubber_glove: {
    group: 'Rubber Obsession',
    label: 'Glove service',
    phrases: [
      'Have them polish your gloves with their tongue.',
      'Smack the gloves lightly against their cheek as punctuation.',
      'Slide a gloved hand slowly across their chest and describe the squeak.',
      'Stuff the glove fingers in their mouth as a gag.',
      'Promise a fresh pair only when they earn it.'
    ]
  },
  slave_protocol: {
    group: 'Slave Dynamics',
    label: 'Protocol drills',
    phrases: [
      'Make them recite full protocol before every movement.',
      'Correct stance with a cane tap when they slouch.',
      'Have them crawl in geometric patterns you dictate.',
      'Inspect them head to toe like property.',
      'Promise advancement through flawless ritual.'
    ]
  },
  slave_chore: {
    group: 'Slave Dynamics',
    label: 'Chore lists',
    phrases: [
      'Read chores like orders carved in steel.',
      'Make them check off each task kneeling at your boots.',
      'Inspect every finished job with white-glove scrutiny.',
      'Punish missed specks or smudges immediately.',
      'Promise a brand-new list tomorrow.'
    ]
  },
  slave_punish: {
    group: 'Slave Dynamics',
    label: 'Punishment chart',
    phrases: [
      'Show them the chart and point to their latest infraction.',
      'Make them select their own penalty from the grid.',
      'Record each punishment loudly so they hear permanence.',
      'Balance harsh lines with soft reassurance afterward.',
      'Promise the chart resets to zero only when deserved.'
    ]
  },
  edge_timer: {
    group: 'Edging / Gooning',
    label: 'Edge timers',
    phrases: [
      'Set a metronome and freeze them on the brink every time it clicks.',
      'Make them stare at a countdown while you hover just out of reach.',
      'Describe the ache building like a siren in their gut.',
      'Reward stillness with a longer tease.',
      'Promise ruined release if they twitch early.'
    ]
  },
  edge_goon: {
    group: 'Edging / Gooning',
    label: 'Goon trance',
    phrases: [
      'Loop filthy affirmations until their eyes glaze.',
      'Make them drool onto their chest while chanting your name.',
      'Play hypnotic beats that sync with their strokes.',
      'Keep them nodding mindlessly for what feels like hours.',
      'Promise to drag them deeper every session.'
    ]
  },
  edge_ruin: {
    group: 'Edging / Gooning',
    label: 'Ruined release',
    phrases: [
      'Warn them the finale is coming with no payoff.',
      'Hold them tight while they spill uselessly.',
      'Describe the frustration as a leash tightening.',
      'Make them thank you for the denial even while shaking.',
      'Promise real release only next time if they serve hard.'
    ]
  },
  machine_fuck: {
    group: 'Machine Play',
    label: 'Fucking machine',
    phrases: [
      'Let them watch the piston slide through lube before it starts.',
      'Buckle them down so the thrust owns them.',
      'Narrate each speed increase like gears shifting.',
      'Hold their throat lightly so they focus on the pounding.',
      'Promise the machine will memorize their favorite rhythm.'
    ]
  },
  machine_milk: {
    group: 'Machine Play',
    label: 'Milking bench',
    phrases: [
      'Strap them face-down and raise the bench slowly.',
      'Describe the milker as a relentless siphon.',
      'Collect every drop like currency owed to you.',
      'Tease them with cooling fans under the bench.',
      'Promise multiple pulls until they’re empty.'
    ]
  },
  machine_drill: {
    group: 'Machine Play',
    label: 'Drill harness',
    phrases: [
      'Show them the rotating attachment and grin.',
      'Lock the harness snug so vibrations travel through bone.',
      'Narrate the drilling as a ritual carving runes inside them.',
      'Adjust torque and make them guess the setting.',
      'Promise to run the drill until they beg in chorus.'
    ]
  }
};

const BASE_KINK_TOPIC_OPTIONS = [
  {
    id: 'abdl',
    label: 'ABDL Comfort',
    options: [
      { key: 'abdl_nursery', label: 'Nursery rituals' },
      { key: 'abdl_diaper_wet', label: 'Diapers (wet only)' },
      { key: 'abdl_diaper_mess', label: 'Diapers (messing)' }
    ]
  },
  {
    id: 'alpha',
    label: 'Alpha Status',
    options: [
      { key: 'alpha_leader', label: 'Pack leader energy' },
      { key: 'alpha_primal', label: 'Primal chase' },
      { key: 'alpha_breath', label: 'Breath commands' }
    ]
  },
  {
    id: 'anal_play',
    label: 'Anal Play',
    options: [
      { key: 'anal_training', label: 'Anal training' },
      { key: 'anal_machines', label: 'Toys & machines' },
      { key: 'anal_prostate', label: 'Prostate focus' }
    ]
  },
  {
    id: 'anal_focus',
    label: 'Anal Play Focus',
    options: [
      { key: 'anal_stretch', label: 'Stretch training' },
      { key: 'anal_machine', label: 'Machine thrusts' },
      { key: 'anal_rimming', label: 'Rimming worship' }
    ]
  },
  {
    id: 'bondage',
    label: 'Bondage & Restraints',
    options: [
      { key: 'bondage_rope', label: 'Rope harness webbing' },
      { key: 'bondage_vacbed', label: 'Vac-bed / sleepsack cocoon' },
      { key: 'bondage_gag', label: 'Locking gag or bit' }
    ]
  },
  {
    id: 'body_types',
    label: 'Body Types Preferred',
    options: [
      { key: 'body_lean', label: 'Lean silhouettes (thin/slim)' },
      { key: 'body_balanced', label: 'Balanced builds (average/toned)' },
      { key: 'body_power', label: 'Power physiques (athletic/muscular)' }
    ]
  },
  {
    id: 'chastity',
    label: 'Chastity Rituals',
    options: [
      { key: 'chastity_key', label: 'Daily key talk' },
      { key: 'chastity_edge', label: 'Edge assignment' },
      { key: 'chastity_unlock', label: 'Unlock ceremony' }
    ]
  },
  {
    id: 'cocksuck',
    label: 'Cock-Sucking Training',
    options: [
      { key: 'cocksuck_gag', label: 'Gag control' },
      { key: 'cocksuck_service', label: 'Service pace' },
      { key: 'cocksuck_face', label: 'Face-fuck focus' }
    ]
  },
  {
    id: 'drone',
    label: 'Drone / Object',
    options: [
      { key: 'drone_number', label: 'Number identity' },
      { key: 'drone_servo', label: 'Servo movements' },
      { key: 'drone_voice', label: 'Voice loop' }
    ]
  },
  {
    id: 'edging',
    label: 'Edging / Gooning',
    options: [
      { key: 'edge_timer', label: 'Edge timers' },
      { key: 'edge_goon', label: 'Goon trance' },
      { key: 'edge_ruin', label: 'Ruined release' }
    ]
  },
  {
    id: 'feet',
    label: 'Feet & Worship',
    options: [
      { key: 'feet_toe', label: 'Toe licking' },
      { key: 'feet_boot', label: 'Boot polish' },
      { key: 'feet_sock', label: 'Sock sniffing' }
    ]
  },
  {
    id: 'fetish',
    label: 'Fetish & Fantasy',
    options: [
      { key: 'fetish_worship', label: 'Body & muscle worship' },
      { key: 'fetish_creature', label: 'Creature / anthro immersion' },
      { key: 'fetish_medical', label: 'Medical or body-mod ritual' }
    ]
  },
  {
    id: 'gear',
    label: 'Gear & Clothing',
    options: [
      { key: 'gear_leather', label: 'Leather / neoprene armor' },
      { key: 'gear_rubber', label: 'Rubber or latex suits' },
      { key: 'gear_uniform', label: 'Uniform & military fetish' }
    ]
  },
  {
    id: 'hypnosis',
    label: 'Hypnosis & Mindset',
    options: [
      { key: 'hypno_induction', label: 'Deep induction loops' },
      { key: 'hypno_conditioning', label: 'Conditioning mantras' },
      { key: 'hypno_aftercare', label: 'Aftercare mental soothing' }
    ]
  },
  {
    id: 'impact',
    label: 'Impact / CBT',
    options: [
      { key: 'impact_spank', label: 'Spanking & flogging' },
      { key: 'impact_whips', label: 'Whips / wrestling' },
      { key: 'impact_cbt', label: 'CBT play' }
    ]
  },
  {
    id: 'interaction',
    label: 'Interaction Style',
    options: [
      { key: 'interaction_cuddle', label: 'Cuddling & afterplay' },
      { key: 'interaction_wrestle', label: 'Wrestle / roughhousing' },
      { key: 'interaction_group', label: 'Small-pack / group energy' }
    ]
  },
  {
    id: 'machine',
    label: 'Machine Play',
    options: [
      { key: 'machine_fuck', label: 'Fucking machine' },
      { key: 'machine_milk', label: 'Milking bench' },
      { key: 'machine_drill', label: 'Drill harness' }
    ]
  },
  {
    id: 'muscle',
    label: 'Muscle Focus',
    options: [
      { key: 'muscle_praise', label: 'Bodybuilder praise' },
      { key: 'muscle_compare', label: 'Size comparison' },
      { key: 'muscle_pump', label: 'Pump worship' }
    ]
  },
  {
    id: 'nipple',
    label: 'Nipple Torment',
    options: [
      { key: 'nipple_clamps', label: 'Clamps & chains' },
      { key: 'nipple_suction', label: 'Hooded suction' },
      { key: 'nipple_electro', label: 'Electro flicks' }
    ]
  },
  {
    id: 'pet',
    label: 'Pet Play',
    options: [
      { key: 'pet_parade', label: 'Puppy play parade' },
      { key: 'pet_leash', label: 'Leash & show training' },
      { key: 'pet_kennel', label: 'Kennel / cage downtime' }
    ]
  },
  {
    id: 'piss',
    label: 'Piss Play',
    options: [
      { key: 'piss_shower', label: 'Shower worship' },
      { key: 'piss_drink', label: 'Obedient drinking' },
      { key: 'piss_mark', label: 'Marked kneeling' }
    ]
  },
  {
    id: 'power',
    label: 'Power Dynamics',
    options: [
      { key: 'power_obedience', label: 'Obedience drills' },
      { key: 'power_discipline', label: 'Discipline & punishment' },
      { key: 'power_primal', label: 'Primal chase energy' }
    ]
  },
  {
    id: 'rubber',
    label: 'Rubber Obsession',
    options: [
      { key: 'rubber_inflate', label: 'Inflatable gear' },
      { key: 'rubber_scent', label: 'Rubber scent' },
      { key: 'rubber_glove', label: 'Glove service' }
    ]
  },
  {
    id: 'scene',
    label: 'Scene Structure Elements',
    options: [
      { key: 'structure_edge', label: 'Edge / control pacing' },
      { key: 'structure_rewards', label: 'Reward or punishment beats' },
      { key: 'structure_environment', label: 'Environmental immersion cues' }
    ]
  },
  {
    id: 'sensation',
    label: 'Sensation / Sensory',
    options: [
      { key: 'sensory_deprive', label: 'Sensory deprivation hoods' },
      { key: 'sensory_wax', label: 'Wax & temperature play' },
      { key: 'sensory_breath', label: 'Breath / scent fixation' }
    ]
  },
  {
    id: 'slave',
    label: 'Slave Dynamics',
    options: [
      { key: 'slave_protocol', label: 'Protocol drills' },
      { key: 'slave_chore', label: 'Chore lists' },
      { key: 'slave_punish', label: 'Punishment chart' }
    ]
  }
];

export const DEFAULT_KINK_PHRASES = deepFreeze(cloneDeep(BASE_KINK_PHRASES));
export const KINK_PHRASES = cloneDeep(BASE_KINK_PHRASES);
export const KINK_TOPIC_OPTIONS = deepFreeze(cloneDeep(BASE_KINK_TOPIC_OPTIONS));

export function loadPhraseOverrides() {
  if (!canUseLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDE_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeOverrideMap(JSON.parse(raw));
  } catch (err) {
    console.warn('Failed to load phrase overrides', err);
    return {};
  }
}

export function savePhraseOverrides(overrides = {}) {
  const sanitized = sanitizeOverrideMap(overrides);
  if (!canUseLocalStorage()) return sanitized;
  try {
    window.localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Failed to save phrase overrides', err);
  }
  return sanitized;
}

export function applyPhraseOverrides(overrides = null) {
  const sanitized = overrides ? sanitizeOverrideMap(overrides) : loadPhraseOverrides();
  Object.keys(DEFAULT_KINK_PHRASES).forEach(key => {
    const defaults = DEFAULT_KINK_PHRASES[key];
    const target = KINK_PHRASES[key];
    if (!defaults || !target) return;
    target.group = defaults.group;
    target.label = defaults.label;
    target.phrases = (sanitized[key] && sanitized[key].length ? sanitized[key] : defaults.phrases || []).slice();
  });
  return sanitized;
}

export function setPhraseOverride(optionKey, phrases = []) {
  if (!optionKey || !DEFAULT_KINK_PHRASES[optionKey]) return;
  const lines = sanitizePhraseList(phrases);
  const overrides = loadPhraseOverrides();
  if (lines.length) {
    overrides[optionKey] = lines;
  } else if (overrides[optionKey]) {
    delete overrides[optionKey];
  }
  const saved = savePhraseOverrides(overrides);
  applyPhraseOverrides(saved);
}

export function resetPhraseOverride(optionKey) {
  if (!optionKey || !DEFAULT_KINK_PHRASES[optionKey]) return;
  const overrides = loadPhraseOverrides();
  if (overrides[optionKey]) {
    delete overrides[optionKey];
    savePhraseOverrides(overrides);
  }
  applyPhraseOverrides(overrides);
}

function sanitizeOverrideMap(map) {
  const cleaned = {};
  if (!map || typeof map !== 'object') return cleaned;
  Object.entries(map).forEach(([key, value]) => {
    if (!DEFAULT_KINK_PHRASES[key]) return;
    const phrases = sanitizePhraseList(value);
    if (phrases.length) cleaned[key] = phrases;
  });
  return cleaned;
}

function sanitizePhraseList(list) {
  if (!Array.isArray(list)) return [];
  return list.map(line => (typeof line === 'string' ? line.trim() : '')).filter(Boolean);
}

function cloneDeep(source) {
  return JSON.parse(JSON.stringify(source));
}

function deepFreeze(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  Object.values(obj).forEach(value => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

applyPhraseOverrides();
