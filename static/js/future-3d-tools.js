// أدوات ثلاثية الأبعاد تحاكي المستقبل مع حركة سلسة
let futureScene, futureCamera, futureRenderer;
let futureClock = new THREE.Clock();
let mixers = [];
let models = [];
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let isAnimating = true;

// تهيئة المشهد المستقبلي
function initFutureScene() {
    const container = document.getElementById('future-3d-container');
    
    // إنشاء المشهد
    futureScene = new THREE.Scene();
    futureScene.background = new THREE.Color(0x050510);
    futureScene.fog = new THREE.FogExp2(0x0a0a1a, 0.0025);
    
    // إنشاء الكاميرا
    futureCamera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    futureCamera.position.set(0, 1.5, 5);
    
    // إنشاء المُصيّر
    futureRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    futureRenderer.setPixelRatio(window.devicePixelRatio);
    futureRenderer.setSize(container.clientWidth, container.clientHeight);
    futureRenderer.shadowMap.enabled = true;
    futureRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    futureRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    futureRenderer.toneMappingExposure = 1.2;
    container.appendChild(futureRenderer.domElement);
    
    // إضافة الإضاءة
    addFutureLights();
    
    // إضافة الأرضية
    addFutureFloor();
    
    // إضافة النماذج ثلاثية الأبعاد
    addFutureModels();
    
    // إضافة الجسيمات
    addFutureParticles();
    
    // إضافة أحداث التفاعل
    addFutureEventListeners(container);
    
    // بدء حلقة الرسم
    animateFutureScene();
}

// إضافة الإضاءة للمشهد المستقبلي
function addFutureLights() {
    // إضاءة محيطية
    const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
    futureScene.add(ambientLight);
    
    // إضاءة اتجاهية
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.0001;
    futureScene.add(directionalLight);
    
    // إضاءة نقطية
    const pointLight1 = new THREE.PointLight(0x00f7ff, 1, 20);
    pointLight1.position.set(2, 3, 2);
    futureScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x6c63ff, 1, 20);
    pointLight2.position.set(-2, 3, -2);
    futureScene.add(pointLight2);
}

// إضافة الأرضية للمشهد المستقبلي
function addFutureFloor() {
    const floorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a1a,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false
    });
    
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    floor.receiveShadow = true;
    futureScene.add(floor);
    
    // إضافة شبكة للأرضية
    const gridHelper = new THREE.GridHelper(50, 50, 0x00f7ff, 0x6c63ff);
    gridHelper.position.y = -0.99;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    futureScene.add(gridHelper);
}

// إضافة نماذج ثلاثية الأبعاد للمشهد المستقبلي
function addFutureModels() {
    // إنشاء نماذج هندسية متطورة
    createHolographicSphere(-2, 0, -2);
    createHolographicCube(2, 0, -2);
    createHolographicTorus(0, 0, -3);
    createAIBrain(0, 1.5, 0);
}

// إنشاء كرة هولوغرافية
function createHolographicSphere(x, y, z) {
    const geometry = new THREE.SphereGeometry(0.7, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x00f7ff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData = { type: 'hologram', name: 'كرة المستقبل', description: 'نموذج للذكاء الاصطناعي التوليدي ثلاثي الأبعاد' };
    futureScene.add(sphere);
    models.push(sphere);
    
    // إضافة تأثير هولوغرافي
    const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x00f7ff, transparent: true, opacity: 0.3 })
    );
    wireframe.position.set(x, y, z);
    futureScene.add(wireframe);
    
    // حركة دوران مستمرة
    animateObject(sphere, wireframe);
}

// إنشاء مكعب هولوغرافي
function createHolographicCube(x, y, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x6c63ff,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.userData = { type: 'hologram', name: 'مكعب البيانات', description: 'نموذج لمعالجة البيانات الضخمة' };
    futureScene.add(cube);
    models.push(cube);
    
    // إضافة تأثير هولوغرافي
    const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0x6c63ff, transparent: true, opacity: 0.3 })
    );
    wireframe.position.set(x, y, z);
    futureScene.add(wireframe);
    
    // حركة دوران مستمرة
    animateObject(cube, wireframe);
}

// إنشاء حلقة هولوغرافية
function createHolographicTorus(x, y, z) {
    const geometry = new THREE.TorusGeometry(0.7, 0.2, 16, 100);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xff4d8d,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });
    
    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(x, y, z);
    torus.castShadow = true;
    torus.receiveShadow = true;
    torus.userData = { type: 'hologram', name: 'حلقة التعلم العميق', description: 'نموذج لشبكات التعلم العميق وتحليل البيانات' };
    futureScene.add(torus);
    models.push(torus);
    
    // إضافة تأثير هولوغرافي
    const wireframe = new THREE.LineSegments(
        new THREE.WireframeGeometry(geometry),
        new THREE.LineBasicMaterial({ color: 0xff4d8d, transparent: true, opacity: 0.3 })
    );
    wireframe.position.set(x, y, z);
    futureScene.add(wireframe);
    
    // حركة دوران مستمرة
    animateObject(torus, wireframe);
}

// إنشاء نموذج دماغ الذكاء الاصطناعي
function createAIBrain(x, y, z) {
    // إنشاء نموذج معقد يشبه الدماغ
    const brainGroup = new THREE.Group();
    brainGroup.position.set(x, y, z);
    brainGroup.userData = { type: 'hologram', name: 'دماغ الذكاء الاصطناعي', description: 'نموذج متقدم لمحاكاة الذكاء الاصطناعي العصبي' };
    futureScene.add(brainGroup);
    models.push(brainGroup);
    
    // إنشاء شبكة من الكرات الصغيرة والخطوط لتمثيل الدماغ
    const particleCount = 200;
    const particles = new THREE.Group();
    const connections = new THREE.Group();
    
    for (let i = 0; i < particleCount; i++) {
        // إنشاء جسيم عشوائي ضمن شكل بيضاوي
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 0.8 + Math.random() * 0.3;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = (radius * 0.8) * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        // إنشاء كرة صغيرة
        const geometry = new THREE.SphereGeometry(0.03, 8, 8);
        const material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5),
            emissive: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z);
        particle.userData = { originalPosition: new THREE.Vector3(x, y, z) };
        particles.add(particle);
        
        // إنشاء اتصالات عشوائية بين الجسيمات
        if (i > 0 && Math.random() > 0.8) {
            const prevParticle = particles.children[Math.floor(Math.random() * i)];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                particle.position,
                prevParticle.position
            ]);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: material.color,
                transparent: true,
                opacity: 0.3
            });
            
            const line = new THREE.Line(lineGeometry, lineMaterial);
            connections.add(line);
        }
    }
    
    brainGroup.add(particles);
    brainGroup.add(connections);
    
    // إضافة حركة نبض للدماغ
    animateBrain(brainGroup);
}

// إضافة جسيمات للمشهد المستقبلي
function addFutureParticles() {
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // مواقع عشوائية ضمن مكعب كبير
        particlePositions[i3] = (Math.random() - 0.5) * 30;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 30;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 30;
        
        // أحجام عشوائية
        particleSizes[i] = Math.random() * 0.1 + 0.05;
        
        // ألوان عشوائية ضمن نطاق الألوان الزرقاء والأرجوانية
        const hue = Math.random() * 0.2 + 0.5; // من 0.5 إلى 0.7 (أزرق إلى أرجواني)
        const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
        particleColors[i3] = color.r;
        particleColors[i3 + 1] = color.g;
        particleColors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    futureScene.add(particles);
    
    // حركة الجسيمات
    animateParticles(particles);
}

// إضافة أحداث التفاعل للمشهد المستقبلي
function addFutureEventListeners(container) {
    // تحديث حجم المشهد عند تغيير حجم النافذة
    window.addEventListener('resize', function() {
        futureCamera.aspect = container.clientWidth / container.clientHeight;
        futureCamera.updateProjectionMatrix();
        futureRenderer.setSize(container.clientWidth, container.clientHeight);
    });
    
    // التفاعل مع النماذج عند النقر
    container.addEventListener('click', function(event) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, futureCamera);
        const intersects = raycaster.intersectObjects(models, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            const userData = object.userData || (object.parent ? object.parent.userData : null);
            
            if (userData && userData.name) {
                showModelInfo(userData);
            }
        }
    });
    
    // تحريك المشهد بالماوس
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    container.addEventListener('mousedown', function(event) {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });
    
    container.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };
            
            // حركة سلسة للكاميرا
            const rotationSpeed = 0.003;
            futureCamera.position.x = futureCamera.position.x * Math.cos(deltaMove.x * rotationSpeed) - futureCamera.position.z * Math.sin(deltaMove.x * rotationSpeed);
            futureCamera.position.z = futureCamera.position.x * Math.sin(deltaMove.x * rotationSpeed) + futureCamera.position.z * Math.cos(deltaMove.x * rotationSpeed);
            
            futureCamera.position.y += deltaMove.y * rotationSpeed * 2;
            futureCamera.position.y = Math.max(0.5, Math.min(10, futureCamera.position.y)); // تقييد الارتفاع
            
            futureCamera.lookAt(0, 0, 0);
            
            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });
    
    container.addEventListener('mouseup', function() {
        isDragging = false;
    });
    
    container.addEventListener('mouseleave', function() {
        isDragging = false;
    });
    
    // تكبير/تصغير بعجلة الماوس
    container.addEventListener('wheel', function(event) {
        event.preventDefault();
        
        const zoomSpeed = 0.1;
        const distance = futureCamera.position.distanceTo(new THREE.Vector3(0, 0, 0));
        const delta = event.deltaY > 0 ? 1 : -1;
        
        // حساب المسافة الجديدة مع تقييدها
        const newDistance = Math.max(3, Math.min(15, distance + delta * zoomSpeed * distance));
        
        // تطبيق المسافة الجديدة مع الحفاظ على الاتجاه
        const direction = futureCamera.position.clone().normalize();
        futureCamera.position.copy(direction.multiplyScalar(newDistance));
        
        futureCamera.lookAt(0, 0, 0);
    });
}

// عرض معلومات النموذج
function showModelInfo(userData) {
    const infoPanel = document.getElementById('future-info-panel');
    const infoTitle = document.getElementById('future-info-title');
    const infoDescription = document.getElementById('future-info-description');
    
    if (infoPanel && infoTitle && infoDescription) {
        infoTitle.textContent = userData.name || 'نموذج ثلاثي الأبعاد';
        infoDescription.textContent = userData.description || 'نموذج تفاعلي للذكاء الاصطناعي';
        
        // إظهار لوحة المعلومات بتأثير سلس
        infoPanel.classList.add('visible');
        
        // إخفاء اللوحة بعد 5 ثوانٍ
        setTimeout(function() {
            infoPanel.classList.remove('visible');
        }, 5000);
    }
}

// حركة دوران مستمرة للأجسام
function animateObject(object, wireframe) {
    object.userData.animation = {
        rotationSpeed: {
            x: Math.random() * 0.01,
            y: Math.random() * 0.01,
            z: Math.random() * 0.01
        }
    };
    
    if (wireframe) {
        wireframe.userData = {
            animation: {
                rotationSpeed: object.userData.animation.rotationSpeed
            }
        };
    }
}

// حركة نبض للدماغ
function animateBrain(brainGroup) {
    brainGroup.userData.animation = {
        pulseSpeed: 0.002,
        pulseTime: 0
    };
}

// حركة الجسيمات
function animateParticles(particles) {
    particles.userData.animation = {
        time: 0,
        speed: 0.0005
    };
}

// حلقة الرسم للمشهد المستقبلي
function animateFutureScene() {
    if (!isAnimating) return;
    
    requestAnimationFrame(animateFutureScene);
    
    const delta = futureClock.getDelta();
    const elapsedTime = futureClock.getElapsedTime();
    
    // تحديث الخلاطات (إذا كانت موجودة)
    for (let i = 0; i < mixers.length; i++) {
        mixers[i].update(delta);
    }
    
    // تحديث النماذج
    futureScene.traverse(function(object) {
        if (object.userData && object.userData.animation) {
            // دوران الأجسام
            if (object.userData.animation.rotationSpeed) {
                object.rotation.x += object.userData.animation.rotationSpeed.x;
                object.rotation.y += object.userData.animation.rotationSpeed.y;
                object.rotation.z += object.userData.animation.rotationSpeed.z;
            }
            
            // نبض الدماغ
            if (object.userData.animation.pulseSpeed) {
                object.userData.animation.pulseTime += object.userData.animation.pulseSpeed;
                const pulseFactor = 1 + Math.sin(object.userData.animation.pulseTime) * 0.05;
                
                object.scale.set(pulseFactor, pulseFactor, pulseFactor);
                
                // تحديث مواقع الجسيمات في الدماغ
                if (object.children.length > 0) {
                    const particles = object.children[0];
                    
                    for (let i = 0; i < particles.children.length; i++) {
                        const particle = particles.children[i];
                        if (particle.userData && particle.userData.originalPosition) {
                            const originalPos = particle.userData.originalPosition;
                            
                            // إضافة حركة عشوائية صغيرة
                            const noise = 0.02;
                            particle.position.x = originalPos.x + (Math.random() - 0.5) * noise;
                            particle.position.y = originalPos.y + (Math.random() - 0.5) * noise;
                            particle.position.z = originalPos.z + (Math.random() - 0.5) * noise;
                        }
                    }
                }
            }
            
            // حركة الجسيمات
            if (object.userData.animation.time !== undefined) {
                object.userData.animation.time += object.userData.animation.speed || 0.001;
                
                if (object.type === 'Points') {
                    const positions = object.geometry.attributes.position.array;
                    
                    for (let i = 0; i < positions.length; i += 3) {
                        // حركة دائرية بطيئة
                        const x = positions[i];
                        const z = positions[i + 2];
                        
                        positions[i] = x * Math.cos(object.userData.animation.time * 0.1) - z * Math.sin(object.userData.animation.time * 0.1);
                        positions[i + 2] = x * Math.sin(object.userData.animation.time * 0.1) + z * Math.cos(object.userData.animation.time * 0.1);
                    }
                    
                    object.geometry.attributes.position.needsUpdate = true;
                }
            }
        }
    });
    
    // تحريك الكاميرا بشكل دائري بطيء
    const cameraRadius = Math.sqrt(futureCamera.position.x * futureCamera.position.x + futureCamera.position.z * futureCamera.position.z);
    const cameraAngle = elapsedTime * 0.05;
    
    futureCamera.position.x = Math.sin(cameraAngle) * cameraRadius;
    futureCamera.position.z = Math.cos(cameraAngle) * cameraRadius;
    futureCamera.lookAt(0, 0, 0);
    
    // رسم المشهد
    futureRenderer.render(futureScene, futureCamera);
}

// تصدير الدوال
window.initFutureScene = initFutureScene;
