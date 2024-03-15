// Imports
const { createStore } = Redux;
const { Provider, connect } = ReactRedux;
const { Component, createRef } = React;

const COMBOBOX_LIST_MAX_HEIGHT = '440px';
// constants
const ADD_ITEM = "ADD_ITEM";
const UPDATE_CURRENT = "UPDATE_CURRENT";
const DELETE_ITEM = "DELETE_ITEM";
const UPDATE_ITEM = "UPDATE_ITEM";
const SHOW_NEW_CONDITION_SECTION = "SHOW_NEW_CONDITION_SECTION";
const HIDE_NEW_CONDITION_SECTION = "HIDE_NEW_CONDITION_SECTION";


const MAX_NUM_DISABILITY_SUGGESTIONS = 20;
const DISABILITIES_OBJECT = {
  0: 'ACL tear (anterior cruciate ligament tear), right',
  1: 'ACL tear (anterior cruciate ligament tear), left',
  2: 'ACL tear (anterior cruciate ligament tear), bilateral',
  3: 'acne',
  4: 'adjustment disorder',
  5: 'agoraphobia',
  6: 'alopecia',
  7: 'ALS (amyotrophic lateral sclerosis)',
  8: 'anal cancer',
  9: 'anal or perianal fistula (fistula-in-ano)',
  10: 'anemia',
  11: 'ankle replacement (ankle arthroplasty), right',
  12: 'ankle replacement (ankle arthroplasty), left',
  13: 'ankle replacement (ankle arthroplasty), bilateral',
  14: 'ankle sprain, right',
  15: 'ankle sprain, left',
  16: 'ankle sprain, bilateral',
  17: 'ankylosis in ankle, right',
  18: 'ankylosis in ankle, left',
  19: 'ankylosis in ankle, bilateral',
  20: 'ankylosis in elbow, right',
  21: 'ankylosis in elbow, left',
  22: 'ankylosis in elbow, bilateral',
  23: 'ankylosis in hand or fingers, right',
  24: 'ankylosis in hand or fingers, left',
  25: 'ankylosis in hand or fingers, bilateral',
  26: 'ankylosis in hip, right',
  27: 'ankylosis in hip, left',
  28: 'ankylosis in hip, bilateral',
  29: 'ankylosis in knee, right',
  30: 'ankylosis in knee, left',
  31: 'ankylosis in knee, bilateral',
  32: 'ankylosis in shoulder, right',
  33: 'ankylosis in shoulder, left',
  34: 'ankylosis in shoulder, bilateral',
  35: 'ankylosis in wrist, right',
  36: 'ankylosis in wrist, left',
  37: 'ankylosis in wrist, bilateral',
  38: 'anorexia (type of eating disorder)',
  39: 'aortic insufficiency (aortic regurgitation)',
  40: 'aortic valve disease',
  41: 'arrhythmia (irregular heartbeat)',
  42: 'asthma',
  43: 'astragalectomy or talectomy (removal of talus bone in ankle), right',
  44: 'astragalectomy or talectomy (removal of talus bone in ankle), left',
  45: 'astragalectomy or talectomy (removal of talus bone in ankle), bilateral',
  46: "athlete's foot (tinea pedis)",
  47: 'atrial fibrillation (A-fib)',
  48: 'bipolar disorder',
  49: 'bladder cancer',
  50: 'bladder stones',
  51: 'Boutonniere deformity in fingers, right',
  52: 'Boutonniere deformity in fingers, left',
  53: 'Boutonniere deformity in fingers, bilateral',
  54: 'bulimia (type of eating disorder)',
  55: 'bunions (hallux valgus), right',
  56: 'bunions (hallux valgus), left',
  57: 'bunions (hallux valgus), bilateral',
  58: 'bursitis in ankle, right',
  59: 'bursitis in ankle, left',
  60: 'bursitis in ankle, bilateral',
  61: 'bursitis in elbow, right',
  62: 'bursitis in elbow, left',
  63: 'bursitis in elbow, bilateral',
  64: 'bursitis in foot, right',
  65: 'bursitis in foot, left',
  66: 'bursitis in foot, bilateral',
  67: 'bursitis in hand or fingers, right',
  68: 'bursitis in hand or fingers, left',
  69: 'bursitis in hand or fingers, bilateral',
  70: 'bursitis in hip, right',
  71: 'bursitis in hip, left',
  72: 'bursitis in hip, bilateral',
  73: 'bursitis in knee, right',
  74: 'bursitis in knee, left',
  75: 'bursitis in knee, bilateral',
  76: 'bursitis in shoulder, right',
  77: 'bursitis in shoulder, left',
  78: 'bursitis in shoulder, bilateral',
  79: 'bursitis in wrist, right',
  80: 'bursitis in wrist, left',
  81: 'bursitis in wrist, bilateral',
  82: 'carpal tunnel syndrome, right',
  83: 'carpal tunnel syndrome, left',
  84: 'carpal tunnel syndrome, bilateral',
  85: 'cervical spinal stenosis (narrowing of spinal canal in neck)',
  86: 'chloracne',
  87: 'chronic bronchitis',
  88: 'chronic conjunctivitis (pink eye)',
  89: 'chronic fatigue syndrome',
  90: 'chronic kidney disease (CKD)',
  91: 'chronic laryngitis',
  92: 'chronic nephritis (inflammation of kidneys)',
  93: 'chronic obstructive pulmonary disease (COPD)',
  94: "chronic otitis externa (swimmer's ear), right",
  95: "chronic otitis externa (swimmer's ear), left",
  96: "chronic otitis externa (swimmer's ear), bilateral",
  97: 'chronic rhinitis, allergic or non-allergic',
  98: 'chronic sinusitis',
  99: 'chronic suppurative otitis media (CSOM) or mastoiditis, right',
  100: 'chronic suppurative otitis media (CSOM) or mastoiditis, left',
  101: 'chronic suppurative otitis media (CSOM) or mastoiditis, bilateral',
  102: 'cirrhosis (scarring of liver)',
  103: 'claw foot (pes cavus), right',
  104: 'claw foot (pes cavus), left',
  105: 'claw foot (pes cavus), bilateral',
  106: 'colorectal cancer or colon cancer',
  107: 'complete loss of sense of smell (anosmia)',
  108: 'complete loss of sense of taste (ageusia)',
  109: 'congestive heart failure (CHF)',
  110: 'coronary artery disease (CAD or arteriosclerotic heart disease)',
  111: 'costochondritis',
  112: 'Cranial nerve paralysis or cranial neuritis (inflammation of cranial nerves)',
  113: 'cranial neuralgia (cranial nerve pain)',
  114: "Crohn's disease",
  115: 'cyclothymic disorder (mild bipolar disorder)',
  116: "De Quervain's tenosynovitis (De Quervain's syndrome), right",
  117: "De Quervain's tenosynovitis (De Quervain's syndrome), left",
  118: "De Quervain's tenosynovitis (De Quervain's syndrome), bilateral",
  119: 'decompression illness',
  120: 'deep vein thrombosis (DVT) in leg, right',
  121: 'deep vein thrombosis (DVT) in leg, left',
  122: 'deep vein thrombosis (DVT) in leg, bilateral',
  123: 'degenerative arthritis (osteoarthritis) in ankle, right',
  124: 'degenerative arthritis (osteoarthritis) in ankle, left',
  125: 'degenerative arthritis (osteoarthritis) in ankle, bilateral',
  126: 'degenerative arthritis (osteoarthritis) in elbow, right',
  127: 'degenerative arthritis (osteoarthritis) in elbow, left',
  128: 'degenerative arthritis (osteoarthritis) in elbow, bilateral',
  129: 'degenerative arthritis (osteoarthritis) in foot, right',
  130: 'degenerative arthritis (osteoarthritis) in foot, left',
  131: 'degenerative arthritis (osteoarthritis) in foot, bilateral',
  132: 'degenerative arthritis (osteoarthritis) in hand or fingers, right',
  133: 'degenerative arthritis (osteoarthritis) in hand or fingers, left',
  134: 'degenerative arthritis (osteoarthritis) in hand or fingers, bilateral',
  135: 'degenerative arthritis (osteoarthritis) in hip, right',
  136: 'degenerative arthritis (osteoarthritis) in hip, left',
  137: 'degenerative arthritis (osteoarthritis) in hip, bilateral',
  138: 'degenerative arthritis (osteoarthritis) in knee, right',
  139: 'degenerative arthritis (osteoarthritis) in knee, left',
  140: 'degenerative arthritis (osteoarthritis) in knee, bilateral',
  141: 'degenerative arthritis (osteoarthritis) in shoulder, right',
  142: 'degenerative arthritis (osteoarthritis) in shoulder, left',
  143: 'degenerative arthritis (osteoarthritis) in shoulder, bilateral',
  144: 'degenerative arthritis (osteoarthritis) in wrist, right',
  145: 'degenerative arthritis (osteoarthritis) in wrist, left',
  146: 'degenerative arthritis (osteoarthritis) in wrist, bilateral',
  147: 'depression (major depressive disorder)',
  148: "Dupuytren's contracture (abnormal thickening of tissues in palm of hand), right",
  149: "Dupuytren's contracture (abnormal thickening of tissues in palm of hand), left",
  150: "Dupuytren's contracture (abnormal thickening of tissues in palm of hand), bilateral",
  151: 'deviated septum',
  152: 'diabetes insipidus',
  153: 'diabetes, type 1 or type 2',
  154: 'diabetic nephropathy (diabetic kidney disease)',
  155: 'diabetic peripheral neuropathy, right lower extremities',
  156: 'diabetic peripheral neuropathy, right upper extremities',
  157: 'diabetic peripheral neuropathy, left lower extremities',
  158: 'diabetic peripheral neuropathy, left upper extremities',
  159: 'diabetic peripheral neuropathy, bilateral lower extremities',
  160: 'diabetic peripheral neuropathy, bilateral upper extremities',
  161: 'diabetic retinopathy',
  162: 'dry eye syndrome',
  163: 'dysphagia (difficulty swallowing), associated with neurological disorder',
  164: 'dysphagia (difficulty swallowing), not associated with neurological disorder',
  165: 'eczema (atopic dermatitis)',
  166: 'elbow replacement (elbow arthroplasty), right',
  167: 'elbow replacement (elbow arthroplasty), left',
  168: 'elbow replacement (elbow arthroplasty), bilateral',
  169: 'endometriosis',
  170: 'enlarged prostate (benign prostatic hyperplasia or BPH)',
  171: 'epididymitis',
  172: 'epiphora (watery eyes)',
  173: 'erectile dysfunction (ED)',
  174: 'esophageal cancer',
  175: 'esophageal stricture (narrowing of esophagus)',
  176: 'fecal incontinence (loss of bowel control)',
  177: 'female sexual arousal disorder (FSAD)',
  178: 'femoral hernia (hernia in thigh area)',
  179: 'fibromyalgia',
  180: 'flatfoot (pes planus), right',
  181: 'flatfoot (pes planus), left',
  182: 'flatfoot (pes planus), bilateral',
  183: 'foot fracture (tarsal or metatarsal fracture), right',
  184: 'foot fracture (tarsal or metatarsal fracture), left',
  185: 'foot fracture (tarsal or metatarsal fracture), bilateral',
  186: 'frostbite in foot, right',
  187: 'frostbite in foot, left',
  188: 'frostbite in foot, bilateral',
  189: 'frostbite in hand or fingers, right',
  190: 'frostbite in hand or fingers, left',
  191: 'frostbite in hand or fingers, bilateral',
  192: 'gallstones (cholelithiasis)',
  193: "gamekeeper's thumb, right",
  194: "gamekeeper's thumb, left",
  195: "gamekeeper's thumb, bilateral",
  196: 'ganglion cyst in hand or fingers, right',
  197: 'ganglion cyst in hand or fingers, left',
  198: 'ganglion cyst in hand or fingers, bilateral',
  199: 'ganglion cyst in wrist, right',
  200: 'ganglion cyst in wrist, left',
  201: 'ganglion cyst in wrist, bilateral',
  202: 'generalized anxiety disorder (GAD)',
  203: 'GERD (gastroesophageal reflux disease)',
  204: 'glaucoma',
  205: "golfer's elbow (medial epicondylitis), right",
  206: "golfer's elbow (medial epicondylitis), left",
  207: "golfer's elbow (medial epicondylitis), bilateral",
  208: 'gonococcal arthritis',
  209: 'gout in foot, right',
  210: 'gout in foot, left',
  211: 'gout in foot, bilateral',
  212: 'gout in wrist, right',
  213: 'gout in wrist, left',
  214: 'gout in wrist, bilateral',
  215: 'greater trochanteric pain syndrome (lateral hip pain), right',
  216: 'greater trochanteric pain syndrome (lateral hip pain), left',
  217: 'greater trochanteric pain syndrome (lateral hip pain), bilateral',
  218: 'hallux rigidus (big toe arthritis), bilateral',
  219: 'hallux rigidus (big toe arthritis), left',
  220: 'hallux rigidus (big toe arthritis), right',
  221: 'hammer toe, right',
  222: 'hammer toe, left',
  223: 'hammer toe, bilateral',
  224: "Hansen's disease (leprosy)",
  225: 'hearing loss, other than tinnitus',
  226: 'heart attack (myocardial infarction)',
  227: 'heart bypass surgery (coronary artery bypass graft)',
  228: 'hemorrhoids',
  229: 'hepatitis B',
  230: 'hepatitis C',
  231: 'herpes (herpes simplex virus or HSV)',
  232: 'hiatal hernia',
  233: 'hip impingement (femoroacetabular impingement or FAI), right',
  234: 'hip impingement (femoroacetabular impingement or FAI), left',
  235: 'hip impingement (femoroacetabular impingement or FAI), bilateral',
  236: 'hip replacement (hip arthroplasty), right',
  237: 'hip replacement (hip arthroplasty), left',
  238: 'hip replacement (hip arthroplasty), bilateral',
  239: 'hip sprain, right',
  240: 'hip sprain, left',
  241: 'hip sprain, bilateral',
  242: 'HIV-related illness',
  243: 'Hodgkin lymphoma',
  244: 'hydrocele, right',
  245: 'hyperhidrosis (excessive sweating)',
  246: 'hypertension (high blood pressure)',
  247: 'hyperthyroidism (overactive thyroid)',
  248: 'hypothyroidism (underactive thyroid)',
  249: 'hysterectomy (removal of uterus)',
  250: 'hysterectomy and ovariectomy (removal of uterus and both ovaries)',
  251: 'illness anxiety disorder (hypochondria)',
  252: 'immersion foot, right',
  253: 'immersion foot, left',
  254: 'immersion foot, bilateral',
  255: 'inguinal hernia (hernia in groin)',
  256: 'intervertebral disc syndrome (IVDS), back',
  257: 'intervertebral disc syndrome (IVDS), neck',
  258: 'iron deficiency anemia',
  259: 'irritable bowel syndrome (IBS)',
  260: 'keratinization skin disorders',
  261: 'kidney cancer (renal cancer)',
  262: 'kidney removal (nephrectomy)',
  263: 'kidney stones (nephrolithiasis)',
  264: 'kidney transplant',
  265: 'knee hyperextension (genu recurvatum), right',
  266: 'knee hyperextension (genu recurvatum), left',
  267: 'knee hyperextension (genu recurvatum), bilateral',
  268: 'knee instability, right',
  269: 'knee instability, left',
  270: 'knee instability, bilateral',
  271: 'knee or patellar dislocation, right',
  272: 'knee or patellar dislocation, left',
  273: 'knee or patellar dislocation, bilateral',
  274: 'knee or patellar fracture, right',
  275: 'knee or patellar fracture, left',
  276: 'knee or patellar fracture, bilateral',
  277: 'knee replacement (knee arthroplasty), right',
  278: 'knee replacement (knee arthroplasty), left',
  279: 'knee replacement (knee arthroplasty), bilateral',
  280: 'knee strain or sprain, right',
  281: 'knee strain or sprain, left',
  282: 'knee strain or sprain, bilateral',
  283: 'labyrinthitis (type of inner ear infection), right',
  284: 'labyrinthitis (type of inner ear infection), left',
  285: 'labyrinthitis (type of inner ear infection), bilateral',
  286: 'laryngeal cancer (cancer of larynx)',
  287: 'leukemia',
  288: 'liver cancer, including hepatocellular carcinoma (HCC)',
  289: 'loss of both eyes',
  290: 'loss of teeth due to bone loss',
  291: 'lower back sprain (lumbosacral sprain)',
  292: 'lower back strain (lumbosacral strain)',
  293: 'lumbar spinal stenosis (narrowing of spinal canal in lower back)',
  294: 'lung cancer',
  295: 'lupus',
  296: 'lymphatic filariasis',
  297: 'malaria',
  298: 'mallet finger, right',
  299: 'mallet finger, left',
  300: 'mallet finger, bilateral',
  301: "Meniere's disease",
  302: 'meniscectomy (removal of meniscus), right',
  303: 'meniscectomy (removal of meniscus), left',
  304: 'meniscectomy (removal of meniscus), bilateral',
  305: 'meniscus tear, right',
  306: 'meniscus tear, left',
  307: 'meniscus tear, bilateral',
  308: 'metatarsalgia (pain in ball of foot), right',
  309: 'metatarsalgia (pain in ball of foot), left',
  310: 'metatarsalgia (pain in ball of foot), bilateral',
  311: 'middle back sprain (thoracic sprain)',
  312: 'middle back strain (thoracic strain)',
  313: 'migraines (headaches)',
  314: 'mitral regurgitation',
  315: 'mitral valve prolapse (Barlow syndrome)',
  316: "Morton's neuroma, right",
  317: "Morton's neuroma, left",
  318: "Morton's neuroma, bilateral",
  319: 'multiple sclerosis (MS)',
  320: 'muscle hernia',
  321: 'myasthenia gravis',
  322: 'nasopharyngeal cancer',
  323: 'neck sprain (cervical sprain)',
  324: 'neck strain (cervical strain)',
  325: 'neurogenic bladder',
  326: 'non-diabetic peripheral neuropathy, right lower extremities',
  327: 'non-diabetic peripheral neuropathy, right upper extremities',
  328: 'non-diabetic peripheral neuropathy, left lower extremities',
  329: 'non-diabetic peripheral neuropathy, left upper extremities',
  330: 'non-diabetic peripheral neuropathy, bilateral lower extremities',
  331: 'non-diabetic peripheral neuropathy, bilateral upper extremities',
  332: 'non-Hodgkin lymphoma',
  333: 'obsessive compulsive disorder (OCD)',
  334: 'orchitis (inflammation of testicles)',
  335: 'oropharyngeal cancer',
  336: 'osteomyelitis',
  337: 'otitis media (middle ear infection), right',
  338: 'otitis media (middle ear infection), left',
  339: 'otitis media (middle ear infection), bilateral',
  340: 'ovarian adhesions',
  341: 'ovarian cysts',
  342: 'ovariectomy (removal of one or both ovaries)',
  343: 'pancreatic cancer',
  344: 'panic disorder',
  345: "Parkinson's disease",
  346: 'patellar or quadriceps tendon rupture, right',
  347: 'patellar or quadriceps tendon rupture, left',
  348: 'patellar or quadriceps tendon rupture, bilateral',
  349: 'patellofemoral pain syndrome, right',
  350: 'patellofemoral pain syndrome, left',
  351: 'patellofemoral pain syndrome, bilateral',
  352: 'PCL tear (posterior cruciate ligament tear), right',
  353: 'PCL tear (posterior cruciate ligament tear), left',
  354: 'PCL tear (posterior cruciate ligament tear), bilateral',
  355: 'penile cancer',
  356: 'perforated eardrum (perforated tympanic membrane), right',
  357: 'perforated eardrum (perforated tympanic membrane), left',
  358: 'perforated eardrum (perforated tympanic membrane), bilateral',
  359: 'persistent depressive disorder (dysthymic disorder)',
  360: 'pharyngeal cancer (throat cancer) ',
  361: 'plantar fasciitis, left',
  362: 'plantar fasciitis, right',
  363: 'plantar fasciitis, bilateral',
  364: 'plantar warts (foot warts), right',
  365: 'plantar warts (foot warts), left',
  366: 'plantar warts (foot warts), bilateral',
  367: 'pneumococcal arthritis',
  368: 'polycystic ovary syndrome (PCOS)',
  369: 'post-traumatic arthritis in ankle, right',
  370: 'post-traumatic arthritis in ankle, left',
  371: 'post-traumatic arthritis in ankle, bilateral',
  372: 'post-traumatic arthritis in elbow, right',
  373: 'post-traumatic arthritis in elbow, left',
  374: 'post-traumatic arthritis in elbow, bilateral',
  375: 'post-traumatic arthritis in foot, right',
  376: 'post-traumatic arthritis in foot, left',
  377: 'post-traumatic arthritis in foot, bilateral',
  378: 'post-traumatic arthritis in hand or fingers, right',
  379: 'post-traumatic arthritis in hand or fingers, left',
  380: 'post-traumatic arthritis in hand or fingers, bilateral',
  381: 'post-traumatic arthritis in hip, right',
  382: 'post-traumatic arthritis in hip, left',
  383: 'post-traumatic arthritis in hip, bilateral',
  384: 'post-traumatic arthritis in knee, right',
  385: 'post-traumatic arthritis in knee, left',
  386: 'post-traumatic arthritis in knee, bilateral',
  387: 'post-traumatic arthritis in shoulder, right',
  388: 'post-traumatic arthritis in shoulder, left',
  389: 'post-traumatic arthritis in shoulder, bilateral',
  390: 'post-traumatic arthritis in wrist, right',
  391: 'post-traumatic arthritis in wrist, left',
  392: 'post-traumatic arthritis in wrist, bilateral',
  393: 'poststreptococcal arthritis',
  394: 'premature ventricular contractions',
  395: 'proctitis (inflammation of rectum)',
  396: 'prostate cancer',
  397: 'prostatitis (inflammation of prostate)',
  398: 'pseudofolliculitis barbae (razor bumps, shave bumps, or ingrown hairs)',
  399: 'psoriasis',
  400: 'PTSD (post-traumatic stress disorder), combat-related',
  401: 'PTSD (post-traumatic stress disorder), non-combat-related',
  402: 'radiculopathy, right lower extremities',
  403: 'radiculopathy, left lower extremities',
  404: 'radiculopathy, bilateral lower extremities',
  405: 'radiculopathy, right upper extremities',
  406: 'radiculopathy, left upper extremities',
  407: 'radiculopathy, bilateral upper extremities',
  408: "Raynaud's disease",
  409: 'rheumatoid arthritis',
  410: 'rib fracture, right',
  411: 'rib fracture, left',
  412: 'rib fracture, bilateral',
  413: 'rib removal',
  414: 'right ventricular hypertrophy (RVH)',
  415: 'left ventricular hypertrophy (LVH)',
  416: 'biventricular hypertrophy',
  417: 'ringworm (dermatophytosis)',
  418: 'rotator cuff tear, right',
  419: 'rotator cuff tear, left',
  420: 'rotator cuff tear, bilateral',
  421: 'scars, extremities or trunk',
  422: 'scars, head, face or neck',
  423: 'schizophrenia',
  424: 'shin splints, right',
  425: 'shin splints, left',
  426: 'shin splints, bilateral',
  427: 'shoulder dislocation, right',
  428: 'shoulder dislocation, left',
  429: 'shoulder dislocation, bilateral',
  430: 'shoulder impingement syndrome, right',
  431: 'shoulder impingement syndrome, left',
  432: 'shoulder impingement syndrome, bilateral',
  433: 'shoulder replacement (shoulder arthroplasty), right',
  434: 'shoulder replacement (shoulder arthroplasty), left',
  435: 'shoulder replacement (shoulder arthroplasty), bilateral',
  436: 'shoulder strain, right',
  437: 'shoulder strain, left',
  438: 'shoulder strain, bilateral',
  439: 'sickle cell anemia',
  440: 'SLAP tear (superior labral anterior to posterior tear), right',
  441: 'SLAP tear (superior labral anterior to posterior), left',
  442: 'SLAP tear (superior labral anterior to posterior tear), bilateral',
  443: 'sleep apnea',
  444: 'somatic symptom disorder (SSD)',
  445: 'spinal arthritis, back',
  446: 'spinal arthritis, neck',
  447: 'spondylolisthesis, back',
  448: 'spondylolisthesis, neck',
  449: 'stomach cancer',
  450: 'stress fracture in leg, right',
  451: 'stress fracture in leg, left',
  452: 'stress fracture in leg, bilateral',
  453: 'syphilitic arthritis',
  454: 'tachycardia',
  455: 'tailbone (coccyx) removal',
  456: 'temporomandibular disorder, including TMJ',
  457: 'tendinosis in hand or fingers, right',
  458: 'tendinosis in hand or fingers, left',
  459: 'tendinosis in hand or fingers, bilateral',
  460: 'tendonitis (tendinitis) in ankle, right',
  461: 'tendonitis (tendinitis) in ankle, left',
  462: 'tendonitis (tendinitis) in ankle, bilateral',
  463: 'tendonitis (tendinitis) in elbow, right',
  464: 'tendonitis (tendinitis) in elbow, left',
  465: 'tendonitis (tendinitis) in elbow, bilateral',
  466: 'tendonitis (tendinitis) in foot, right',
  467: 'tendonitis (tendinitis) in foot, left',
  468: 'tendonitis (tendinitis) in foot, bilateral',
  469: 'tendonitis (tendinitis) in hand or fingers, right',
  470: 'tendonitis (tendinitis) in hand or fingers, left',
  471: 'tendonitis (tendinitis) in hand or fingers, bilateral',
  472: 'tendonitis (tendinitis) in hip, right',
  473: 'tendonitis (tendinitis) in hip, left',
  474: 'tendonitis (tendinitis) in hip, bilateral',
  475: 'tendonitis (tendinitis) in knee, right',
  476: 'tendonitis (tendinitis) in knee, left',
  477: 'tendonitis (tendinitis) in knee, bilateral',
  478: 'tendonitis (tendinitis) in shoulder, right',
  479: 'tendonitis (tendinitis) in shoulder, left',
  480: 'tendonitis (tendinitis) in shoulder, bilateral',
  481: 'tendonitis (tendinitis) in wrist, right',
  482: 'tendonitis (tendinitis) in wrist, left',
  483: 'tendonitis (tendinitis) in wrist, bilateral',
  484: 'tennis elbow (lateral epicondylitis), right',
  485: 'tennis elbow (lateral epicondylitis), left',
  486: 'tennis elbow (lateral epicondylitis), bilateral',
  487: 'tenosynovitis in hand or fingers, right',
  488: 'tenosynovitis in hand or fingers, left',
  489: 'tenosynovitis in hand or fingers, bilateral',
  490: 'tenosynovitis in wrist, right',
  491: 'tenosynovitis in wrist, left',
  492: 'tenosynovitis in wrist, bilateral',
  493: 'testicular cancer',
  494: 'tibia or fibula fracture, right',
  495: 'tibia or fibula fracture, left',
  496: 'tibia or fibula fracture, bilateral',
  497: 'Tietze syndrome',
  498: 'tinnitus (ringing or hissing in ears)',
  499: 'trachea cancer (cancer of windpipe)',
  500: 'traumatic brain injury (TBI)',
  501: 'trigger finger, right',
  502: 'trigger finger, left',
  503: 'trigger finger, bilateral',
  504: 'typhoid arthritis',
  505: 'ulcerative colitis',
  506: 'ureteral cancer (ureter cancer)',
  507: 'urethritis',
  508: 'urinary incontinence (loss of bladder control)',
  509: 'urticaria (hives)',
  510: 'varicocele, right',
  511: 'varicocele, left',
  512: 'varicocele, bilateral',
  513: 'varicose veins in leg',
  514: 'varicose veins, other than in leg',
  515: 'ventral hernia (hernia in abdomen)',
  516: 'visual impairment, including blurry vision, blindness and double vision',
  517: 'vitiligo',
  518: 'weak foot, bilateral',
  519: 'Wolff-Parkinson-White syndrome',
  520: 'wrist fracture, right',
  521: 'wrist fracture, left',
  522: 'wrist fracture, bilateral',
  523: 'wrist replacement (wrist arthroplasty), right',
  524: 'wrist replacement (wrist arthroplasty), left',
  525: 'wrist replacement (wrist arthroplasty), bilateral',
  526: 'wrist sprain, right',
  527: 'wrist sprain, left',
  528: 'wrist sprain, bilateral',
};

// actions
const addItem = (item) => ({ type: ADD_ITEM, payload: item });
const updateCurrent = (current) => ({ type: UPDATE_CURRENT, payload: current });
const deleteItem = (id) => ({ type: DELETE_ITEM, payload: { id } });
const updateItem = (item) => ({ type: UPDATE_ITEM, payload: item });
const showNewConditionSection = () => ({ type: SHOW_NEW_CONDITION_SECTION });
const hideNewConditionSection = () => ({ type: HIDE_NEW_CONDITION_SECTION });
/// Search Method Functions
let GLOBAL_TOGGLE_STRIP_COMMON_WORDS = false;
var splitreg = /[\s-,\(\)]+/;

// keydown stuff
const TAB_KEY_CODE = 9;
const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_CODE = 27;
const UP_ARROW_KEY_CODE = 38;
const DOWN_ARROW_KEY_CODE = 40;

function nodeLcs (str1, str2) {
  if (!str1 || !str2) {
    return {
      length: 0,
      sequence: '',
      offset: 0
    }
  }

  var sequence = ''
  var str1Length = str1.length
  var str2Length = str2.length
  var num = new Array(str1Length)
  var maxlen = 0
  var lastSubsBegin = 0

  for (var i = 0; i < str1Length; i++) {
    var subArray = new Array(str2Length)
    for (var j = 0; j < str2Length; j++) { subArray[j] = 0 }
    num[i] = subArray
  }
  var thisSubsBegin = null
  for (i = 0; i < str1Length; i++) {
    for (j = 0; j < str2Length; j++) {
      if (str1[i] !== str2[j]) { num[i][j] = 0 } else {
        if ((i === 0) || (j === 0)) { num[i][j] = 1 } else { num[i][j] = 1 + num[i - 1][j - 1] }

        if (num[i][j] > maxlen) {
          maxlen = num[i][j]
          thisSubsBegin = i - num[i][j] + 1
          if (lastSubsBegin === thisSubsBegin) { // if the current LCS is the same as the last time this block ran
            sequence += str1[i]
          } else { // this block resets the string builder if a different LCS is found
            lastSubsBegin = thisSubsBegin
            sequence = '' // clear it
            sequence += str1.substr(lastSubsBegin, (i + 1) - lastSubsBegin)
          }
        }
      }
    }
  }
  return {
    length: maxlen,
    sequence: sequence,
    offset: thisSubsBegin
  }
}

function lcsSingleVsMulti(input, list, threshold){
  var results = list
    .map((option) => {
      let label = option.toUpperCase()
      //.replace(/[^a-zA-Z ]/g, "");
      let val = input.toUpperCase().replace(/[^a-zA-Z ]/g, "");
      //let score = label.includes(val) ? 0 : Infinity;
      let score
      if(isOneWord(val)){
        score = nodeLcs(val, label).length
        if(GLOBAL_TOGGLE_STRIP_COMMON_WORDS){
          score = nodeLcs(stripCommonWords(val), stripCommonWords(label)).length
        }
      } else {
        score = lcsScoreByWordSum(val, label)
        if (GLOBAL_TOGGLE_STRIP_COMMON_WORDS) {
          score = lcsScoreByWordSum(stripCommonWords(val), stripCommonWords(label));
        }
      }      
      return {
        score,
        original: option
      };
    }).filter(a => a.score / input.length >= threshold)
    .sort((a, b) => {
      return b.score - a.score;
      // if (result === 0) {
      //   return a.original.length - b.original.length;
      // }
    })
    //.map((sorted) => sorted.original)
    .slice(0, 20);
  return results
  //var base_conditions = findBaseConditions(results, arrWords)
  //return createSortedList(base_conditions, results)
}

function lcsScoreByWordSum(inputWord, disabilityWord){
  let tempScoreList = []
  let splitInput = inputWord.split(splitreg)
  let disWordSplit = disabilityWord.split(splitreg)
  for (let subWord in splitInput){
    disWordSplit.forEach(t => (nodeLcs(t, splitInput[subWord]).length>=3 ? tempScoreList.push(nodeLcs(t, splitInput[subWord]).length) : null))
  }
  let score = tempScoreList.reduce((acc, current) => acc + current, 0)
  return score
}

function isOneWord(inputWord){
  return inputWord.split(splitreg).length < 2
}

function countOverlapWords(input, dropdownTerm){
  let splitInput = input.split(splitreg)
  let splitOption = dropdownTerm.split(splitreg)
    let countOverlap = 0
    let tempOverlapList = []
    for (let word in splitInput) {
      for(let term in splitOption){
        if(splitOption[term].includes(splitInput[word])){
          tempOverlapList.push(splitInput[word])
        }
      }
    };
    let tempUniqueList =  Array.from(new Set(tempOverlapList)) 
      countOverlap = tempUniqueList.length
  return countOverlap
}

function substringSearchCountOverlap(input, list) {
  let scoreFilter = input.toUpperCase().replace(/[^a-zA-Z ]/g, "").split(splitreg).length;
  var results = list
    .map((option) => {
      let label = option.toUpperCase().replace(/[^a-zA-Z ]/g, "");
      let val = input.toUpperCase().replace(/[^a-zA-Z ]/g, "");
      //let score = label.includes(val) ? 0 : Infinity;
      let score = countOverlapWords(val, label)
      if (GLOBAL_TOGGLE_STRIP_COMMON_WORDS) {
          score = countOverlapWords(stripCommonWords(val), stripCommonWords(label));
        }
      return {
        score,
        original: option
      };
    }).filter(a => a.score >= scoreFilter)
    .sort((a, b) => {
      return b.score - a.score;
      // if (result === 0) {
      //   return a.original.length - b.original.length;
      // }
    })
    //.map((a) => a.original)
    .slice(0, 20);
  //var base_conditions = findBaseConditions(results, arrWords)
  //return createSortedList(base_conditions, results)
  return results
}

function substringCountLCS(input, list, threshold){
  let substringCountResults = substringSearchCountOverlap(input, list)
  let lcsSingleVsMultiResults = lcsSingleVsMulti(input, list, threshold)
  // let combinedList = [...substringCountResults, {original: '***lcs starting***'}, ...lcsSingleVsMultiResults]
  let combinedList = [...substringCountResults, ...lcsSingleVsMultiResults]
  let distinctTerms = []
  combinedList.forEach(x => !distinctTerms.includes(x.original) && distinctTerms.push(x.original))
  console.log('searching')
  console.log('distinctTerms: ', distinctTerms);
  return distinctTerms
}
const COMMON_WORDS = [
  'left',
  'right',
  'bilateral',
  'in',
  'of',
  'or',
  'the',
  'my'
];

function stripCommonWords(inputStr){
  let regMatch = new RegExp('\\b(' + COMMON_WORDS.join('|') + ')\\b', 'gi')
  let ret = inputStr.replace(regMatch, '').replace(/\s+/g, ' ').trim()
  return ret
}

// Reducer
const initialState = {
    list: [
      // {
      //   name: "Finger(s)",
      //   id: 1
      // },
      // {
      //   name: "Asthma",
      //   id: 2
      // }
    ],
    current: { name: ""},
    isAddingNewCondition: true
};

const reducer = (state = initialState, action) => {
    console.log("reducer");
    console.log('action', action);
  console.log('state', state)
    switch (action.type) {
        case SHOW_NEW_CONDITION_SECTION:
            return { ...state, isAddingNewCondition: true };
        case HIDE_NEW_CONDITION_SECTION:
            return { ...state, isAddingNewCondition: false };
        case ADD_ITEM:
            return {...state, list: [...state.list, action.payload]};
        case UPDATE_CURRENT:
            return { ...state, current: { ...state.current, ...action.payload } };
        case DELETE_ITEM:
            return { ...state, list: state.list.filter(item => item.id !== action.payload.id) }
        case UPDATE_ITEM:
             return { 
        ...state, 
        list: state.list.map(item => item.id === action.payload.id ? action.payload : item)
    };
        default:
            return state;
    }
}

// Store
const store = createStore(reducer);

class ComboBox extends Component {
  constructor(props) {
    console.log('ComboBox constructor called');
    super(props);
    const { value } = props;
    
    let disabilitiesArr = [];
    for (const property in DISABILITIES_OBJECT) {
      disabilitiesArr.push(DISABILITIES_OBJECT[property]);
    }
    this.disabilitiesArr = disabilitiesArr;
    this.listRef = createRef();
    this.state = {
      searchTerm: value || '',
      filteredOptions: [],
      value: value || '',
      // highlightedIndex: -2, // New state to track the highlighted option index
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if the search term has changed
    if (prevState.searchTerm !== this.state.searchTerm) {
      this.filterOptions();
    }
    if (prevState.value !== '' && this.state.value === '') {
      this.setState({searchTerm: ''})
    }
  }
  
//   componentDidMount() {
//     document.addEventListener('keydown', this.handleKeyDown);
//   }

//   componentWillUnmount() {
//     document.removeEventListener('keydown', this.handleKeyDown);
//   }

  handleKeyDown = (e) => {
    const { highlightedIndex, filteredOptions, searchTerm } = this.state;
    // Down arrow
    if (e.keyCode === 40) {
        e.preventDefault(); // Prevent the page from scrolling
        // const nextIndex = highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0;
        const nextIndex = highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : -1;
        this.setState({ highlightedIndex: nextIndex });
      console.log('update highlightedInex: ', nextIndex);
    }
    // Up arrow
    else if (e.keyCode === 38) {
        e.preventDefault(); // Prevent the page from scrolling
        // const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1;
        const prevIndex = highlightedIndex > -1 ? highlightedIndex - 1 : filteredOptions.length - 1;
        this.setState({ highlightedIndex: prevIndex });
      console.log('update highlightedInex: ', prevIndex);
    }
    // Enter key
    else if (e.keyCode === 13) {
        e.preventDefault(); // Prevent form submission
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            this.selectOption(filteredOptions[highlightedIndex]);
        } else if (highlightedIndex == -1) { // enter "asdf" as ...
            // this.
            this.selectOption(searchTerm);
        }
    }
  }

  handleKeyDownFromInput(evt) {
    console.log('evt: ', evt);
    console.log('evt.key: ', evt.key);
    // TAB_KEY_CODE = 9;
    // ENTER_KEY_CODE = 13;
    // ESCAPE_KEY_CODE = 27;
    // UP_ARROW_KEY_CODE = 38;
    // DOWN_ARROW_KEY_CODE = 40;
    switch (evt.key) {
      case 'Tab':
      case 'ArrowDown':
      case 'ArrowUp':
        const liElem = this.listRef.current.querySelector('.usa-combo-box__list-option');
        // const PREFIX = 'usa';
        // const COMBO_BOX_CLASS = `${PREFIX}-combo-box`;
        // const LIST_OPTION_CLASS = `${COMBO_BOX_CLASS}__list-option`;
        // const LIST_OPTION_FOCUSED_CLASS = `${LIST_OPTION_CLASS}--focused`;
        // liElem.classList.add(LIST_OPTION_FOCUSED_CLASS);
        console.log('liElem.focus():', liElem.focus()); // don't comment, this sets focus
        console.log('document.activeElement: ', document.activeElement);
        evt.preventDefault();
        break;
      case 'Enter':
        this.setState({searchTerm: ''});
        evt.preventDefault();
        break;
      case 'Escape':
        this.setState({searchTerm: ''});
        evt.preventDefault();
        break;
        
      default:
        console.log('default');
        break;
    }
  }

  handleKeyDownFromLi(evt, option) {
    switch (evt.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        const liElem = this.listRef.current.querySelector('.usa-combo-box__list-option');
        // const PREFIX = 'usa';
        // const COMBO_BOX_CLASS = `${PREFIX}-combo-box`;
        // const LIST_OPTION_CLASS = `${COMBO_BOX_CLASS}__list-option`;
        // const LIST_OPTION_FOCUSED_CLASS = `${LIST_OPTION_CLASS}--focused`;
        // liElem.classList.add(LIST_OPTION_FOCUSED_CLASS);
        console.log('liElem.focus():', liElem.focus()); // don't comment, this sets focus
        console.log('document.activeElement: ', document.activeElement);
        evt.preventDefault();
        break;
      case 'Tab':
      case 'Escape':
        this.setState({searchTerm: ''});
        evt.preventDefault();
        break;
      case 'Enter':
        console.log("update to select option for evt: " evt);
        this.setState({searchTerm: option});
        evt.preventDefault();
        break; 
      default:
        console.log('default');
        break;
    }

  }

  filterOptions = () => {
    const { searchTerm, value } = this.state;
    const options = this.disabilitiesArr;
    // let filtered = options.filter(option =>
    //   option.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    let filtered = substringCountLCS(searchTerm, options, 0)
    filtered = filtered.splice(0, MAX_NUM_DISABILITY_SUGGESTIONS);
    if (searchTerm && searchTerm.length === 0) {
      filtered = [];
    }
    if (searchTerm == value) {
      filtered= [];
    }
    this.setState({ filteredOptions: filtered });
  };

  handleSearchChange = (e) => {
    const updatedTerm = e.target.value;
    this.setState({ searchTerm: updatedTerm });
  };
  
  handleClearTextEntry = () => {
    this.setState({
      searchTerm: '',
      value: '',
    });
  }
  
  drawCloseButton() {
    return (
      <span class="usa-combo-box__clear-input__wrapper" tabindex="-1">
        <button type="button" class="usa-combo-box__clear-input" aria-label="Clear the select contents" onClick={() => {this.handleClearTextEntry()}}>&nbsp;</button>
      </span>
    )
  }
  
  drawFreeTextOption(option) {
    //  onKeyDown={(evt) =>{this.handleKeyDownFromLi(evt, option)}} 
    const liText = `Add "${option}" as a new condition`;
    return (
      <li key={-1}  className="usa-combo-box__list-option" onClick={() => {this.selectOption(option)}} style={{ cursor: 'pointer' }} tabIndex="-1">
        Add "<span style={{fontWeight: 'bold'}}>{option}</span>" as a new condition
      </li>
    )
  } 
  
  selectOption(option) {
    this.setState({
      value: option,
      searchTerm: option,
      filteredOptions: [],
    });
    const {onChange} = this.props;
    const { value } = this.state;
    // console.log('calling on change w/ value: ', value);
    // onChange(value);
    console.log('calling on change w/ value: ', option);
    onChange(option);
  }

  highlightOptionWithSearch(option, searchInput) {
    option = option.toLowerCase();
    const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const value = searchInput.toLowerCase();
    const caseInsensitiveMatch = new RegExp(`(${escapeRegExp(value)})`, "i");
    let highlightedText = option
      .split(caseInsensitiveMatch)
      .map((str) =>
           str.toLowerCase() === searchInput
           ? `<span style="font-weight: bold">${str}</span>`
           : str
          )
      .join("");
    return (<div dangerouslySetInnerHTML={{ __html: highlightedText}} />);
  }

  render() {
    const { searchTerm, filteredOptions, value } = this.state;
    // onKeyDown={(evt) => {this.handleKeyDownFromLi(evt, option)}}
    
    return (
      
      <div className="usa-combo-box prototype-combobox-class" data-enhanced="true">
        <input
          type="text"
          className={'usa-combo-box__input'}
          placeholder=""
          value={searchTerm}
          onChange={this.handleSearchChange}
          onKeyDown={(evt) => {this.handleKeyDownFromInput(evt)}}
        />
        { searchTerm.length || value.length ? this.drawCloseButton() : null }
        <ul className={'usa-combo-box__list'} style={{ maxHeight: COMBOBOX_LIST_MAX_HEIGHT }} ref={this.listRef}>
          {searchTerm.length && searchTerm !== value ? this.drawFreeTextOption(searchTerm) : null}
          {filteredOptions.map((option, index) => (
            <li key={index} className="usa-combo-box__list-option" onClick={() => {this.selectOption(option)}} style={{ cursor: 'pointer' }} tabIndex="-1">
              {this.highlightOptionWithSearch(option, searchTerm)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}



// Display addNewConditionSection

function showAddNewConditionSection() {
  console.log("showAddNewConditionSection");
  const link = document.getElementById("addNewConditionSection");
  link.style.display = 'block'; 
  
  /* TODO: Figure out a better way to associate this actions to the buttons */
  const removeNewConditionButton = document.getElementById("removeNewConditionButton");
  removeNewConditionButton.addEventListener('click', function() {
    hideAddNewConditionSection();
  });
}

// Hide addNewConditionSection

function hideAddNewConditionSection() {
  console.log("hideAddNewConditionSection");
  const link = document.getElementById("addNewConditionSection");
  link.style.display = 'none'; 
  
  
  /* TODO: Figure out a better way to associate this actions to the buttons */
  const addNewConditionButton = document.getElementById("addNewConditionButton");
  addNewConditionButton.addEventListener('click', function() {
    showAddNewConditionSection();
  });
  
}



// App
const App = connect(state => state)(class extends Component {
    constructor(props) {
        super(props);
        this.state = { editMode: 0 };
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEditMode = this.handleEditMode.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleAdd() {
      console.log('handleAdd triggered');
      console.log('this.props.current: ', this.props.current);
        const { name} = this.props.current;
        console.log('name: ', name);
        if (name) {
          console.log('name detect');
            this.itemId = (this.itemId || 0) + 1;
            //this.itemId = (this.itemId || uuid.v4());
            //this.itemId = uuid.v4();
            
            this.props.dispatch(addItem({ id: this.itemId, name}));
          console.log('update current w/ initialState.current: ', initialState.current);
            this.props.dispatch(updateCurrent(initialState.current));
          // hide addNewConditionSection after adding condition
          console.log('hideAddNewConditionSection called...');
          // hideAddNewConditionSection();
          this.props.dispatch(hideNewConditionSection());
        }
    }

    handleDelete(evt) {
        this.props.dispatch(deleteItem(Number(evt.target.value)));
         this.props.dispatch(updateCurrent(initialState.current)); // Reset the current item
        this.setState({ editMode: 0 }); // Exit edit mode if we're in it
    }
    handleCloseNewConditionSection() {
      this.props.dispatch(hideNewConditionSection());
    }

    handleChange(obj) {
      console.log("***handleChange");
      console.log(obj);
        this.props.dispatch(updateCurrent(obj));
    }

    handleEditMode(evt) {
      console.log('handleEditMode called with event', evt);
        this.setState({ editMode: Number(evt.target.value) });
        this.props.dispatch(updateCurrent(this.props.list.find(item => item.id=== +evt.target.value)));
    }

    handleEdit() {
      console.log('this', this)
      const { name } = this.props.current;
      
      console.log("***handleEdit");
      
      console.log("updated name: "+ name + "this.state.editMode: " + this.state.editMode);
      
      console.log("----> Props");
      console.log(this.props);
        if (name) {
            this.props.dispatch(updateItem({ id: this.state.editMode, name }));
            this.props.dispatch(updateCurrent(initialState.current));
            this.setState({ editMode: 0 });
        }
    }
    showAddNewConditionSection() {
      this.props.dispatch(showNewConditionSection());
    }

    render() {
        const { current, list, isAddingNewCondition } = this.props;
      
        // const { list } = this.props;
        return (
          
            <div id="addedDisabilities" class="va-growable vads-u-margin-top--2">
              <div name="topOfTable_root_newDisabilities"></div>
              {list.map(item => 
                <div class="va-growable-background" id={"condition" + item.id} key={item.id}>
                  {this.state.editMode !== item.id ?
                    /* This is how the form displays in non-edit mode */
                    <div class="row small-collapse vads-u-display--flex vads-u-align-items--center">
                      <div class="vads-u-flex--fill vads-u-padding-right--2 word-break"
                        id={"disabilityName_"+item.id}
                      >
                        {item.name}
                      </div>
                      <button type="button" class="usa-button-secondary float-right" aria-label={"Edit " + current.name}  value={item.id} onClick={this.handleEditMode} disabled={isAddingNewCondition}>Edit</button>
                    </div>:
                    /* This is how the form displays in edit mode */
                    <div id="addNewConditionSection">
                      <div name="table_root_newDisabilities_1"></div>
                      <div class="row small-collapse">
                        <fieldset class="small-12 columns va-growable-expanded word-break">
                          <legend class="vads-u-font-size--base">Type to find your condition<span class="schemaform-required-span vads-u-font-weight--normal"> (*Required)</span></legend>
                          <div class="input-section">
                            <div class="vads-u-margin-y--2 rjsf-object-field">
                              <div>
                                <div class="schemaform-field-template schemaform-first-field">
                                  <label id="root_newDisabilities_1_condition-label" class="schemaform-label" for="root_newDisabilities_1_condition">
                                  </label>
                                  <div class="schemaform-widget-wrapper">
                                    <div class="autosuggest-container">
                                    {/* This is where we want to embed the new Combo-Box*/}

                                      {/* <ComboBox value={current.name}/> */}
                                      {/* onChange={(value) => this.handleChange({name: value})}
 */}
                                    <ComboBox
                                      value={current.name}
                                      onChange={(value) => this.handleChange({name: value})}

                                    />
                                  
                                      

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="row small-collapse">
                              <div class="small-6 left columns">
                                <button type="button" class="float-left" aria-label="Save Condition" className="btn" onClick={this.handleEdit}>Save</button>
                                <div class="float-left row columns"></div>
                              </div>
                              {/* TODO: Add Remove Action */}
                              <div class="small-6 right columns">{list.length>1 ? <button type="button" class="usa-button-secondary float-right" aria-label="Remove incomplete Condition" value={item.id} onClick={this.handleDelete}>Remove</button> :null}</div>
                            </div>
                            </fieldset>
                          </div>
                      </div>
                   
                  }
                   
                  
                </div>
              )}

              {/* This is the section that we need to show first and hide after adding the first condition. Show only if the user clicks on "Add another condition button" */}
            {isAddingNewCondition && (
                            <div id="addNewConditionSection" class="va-growable-background">
                <div name="table_root_newDisabilities_1"></div>
                <div class="row small-collapse">
                  <fieldset class="small-12 columns va-growable-expanded word-break">
                    <legend class="vads-u-font-size--base">Type to find your condition<span class="schemaform-required-span vads-u-font-weight--normal"> (*Required)</span></legend>
                    <div class="input-section">
                      <div class="vads-u-margin-y--2 rjsf-object-field">
                        <div>
                          <div class="schemaform-field-template schemaform-first-field">
                            <label id="root_newDisabilities_1_condition-label" class="schemaform-label" for="root_newDisabilities_1_condition">
                            </label>
                            <div class="schemaform-widget-wrapper">
                              <div class="autosuggest-container">
                              {/* This is where we want to embed the new Combo-Box*/}
                                {/* attr={{ disabled: this.state.editMode }} */}
                                {/* onChange={(value) => this.handleChange({ name: value })} */}
                                {/*  */}
                                <ComboBox
                                  value={this.state.editMode ? '' : current.name}
                                  onChange={(value) => this.handleChange({name: value})}
                                />
                                  
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      <div class="row small-collapse">
                        <div class="small-6 left columns">
                          <button type="button" class="float-left" aria-label="Save Condition" 
                            disabled={this.state.editMode} onClick={this.handleAdd}>Save</button>
                          <div class="float-left row columns"></div>
                        </div>
                        {/* TODO: Add Remove/Hide button when no conditions are added */}
                        
                        {
                          this.props.list.length>0 ?
                          <div class="small-6 right columns"><button id="removeNewConditionButton" type="button" class="usa-button-secondary float-right" aria-label="Remove incomplete Condition" onclick={this.handleCloseNewConditionSection}>Remove</button> 
                              
                          </div> :
                        <div></div>
                         }
                      </div>
                      </fieldset>
                    </div>
                </div>
            )}

            {/* <button id="addNewConditionButton" type="button" class="usa-button-secondary va-growable-add-btn" onclick="showAddNewConditionSection()">Add another condition</button>
            </div> */}
          <button id="addNewConditionButton" type="button" class="usa-button-secondary va-growable-add-btn" onClick={() => {this.showAddNewConditionSection()}} disabled={isAddingNewCondition || this.state.editMode}>Add another condition</button> 
        </div>
           
        );
    }
});

// index.js
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('cc-root')
);
