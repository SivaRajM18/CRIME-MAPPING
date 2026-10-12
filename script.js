// CrimeMap concept interface. Map markers are illustrative; connect only authorised, verified records.
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const opened = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(opened));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));
  }

  // Reveal sections and cards as they enter view, with a reduced-motion fallback.
  document.querySelectorAll("main section, .feature-card, .stat-card, .step, .map-panel, .hero-art").forEach((el, index) => {
    if (!el.classList.contains("ticker") && !el.classList.contains("closing")) el.classList.add("reveal");
    if (el.classList.contains("feature-card") || el.classList.contains("stat-card") || el.classList.contains("step")) el.style.setProperty("--reveal-order", index);
  });
  const scrollProgress = document.getElementById("scrollProgress");
  const updateScrollProgress = () => {
    if (!scrollProgress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealElements.forEach(el => revealObserver.observe(el));
  } else revealElements.forEach(el => el.classList.add("visible"));

  // Fictional illustrative records only — not real incidents or official police records.
  const sampleIncidents = [
    { coords:[13.0827,80.2707], title:"Sample report · Central zone", kind:"Illustrative report", type:"incident", desc:"Fictional record for demonstrating location review, source quality and incident details.", date:"Record date: 08 Oct 2026" },
    { coords:[13.0674,80.2376], title:"Sample report · West zone", kind:"Illustrative report", type:"incident", desc:"Fictional record only. Production records should be verified and access-controlled.", date:"Record date: 05 Oct 2026" },
    { coords:[13.1067,80.2921], title:"Sample report · North-east zone", kind:"Illustrative report", type:"incident", desc:"A map cluster is not evidence against any person or community. Review trusted sources and reporting bias.", date:"Record date: 02 Oct 2026" },
    { coords:[13.0902,80.2584], title:"Sample report · North-central zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 07 Oct 2026" },
    { coords:[13.0755,80.2825], title:"Sample report · East-central zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 06 Oct 2026" },
    { coords:[13.0558,80.2462], title:"Sample report · South-west zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 04 Oct 2026" },
    { coords:[13.1142,80.2685], title:"Sample report · North zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 03 Oct 2026" },
    { coords:[13.0617,80.2928], title:"Sample report · South-east zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 01 Oct 2026" },
    { coords:[13.0950,80.2308], title:"Sample report · North-west zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 30 Sep 2026" },
    { coords:[13.0448,80.2702], title:"Sample report · South zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 29 Sep 2026" },
    { coords:[13.0876,80.2990], title:"Sample report · Coastal zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 28 Sep 2026" },
    { coords:[13.0721,80.2208], title:"Sample report · West-central zone", kind:"Illustrative report", type:"incident", desc:"Fictional location marker. Tap this point to inspect the sample record.", date:"Record date: 27 Sep 2026" },
    { coords:[13.0475,80.2090], title:"Community facility · sample", kind:"Illustrative facility", type:"facility", desc:"A fictional facility marker demonstrating how community resources can be displayed separately.", date:"Map layer: community resources" }
  ];

  if (typeof L === "undefined" || !document.getElementById("crimeMap")) {
    console.warn("CrimeMap: Leaflet did not load; map functions need an internet connection. Case Desk tools remain available.");
  } else {
    const map = L.map("crimeMap", { zoomControl:true, scrollWheelZoom:false }).setView([13.0827,80.2707],12);
    const streetLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors', maxZoom:19
    });
    const satelliteLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution:'Imagery &copy; Esri and contributors', maxZoom:19
    });
    satelliteLayer.addTo(map);

    const incidentRecords = sampleIncidents.filter(record => record.type === "incident").map((record,index) => ({
      ...record,
      id:`CM-DEMO-${104-index}`,
      category:["Theft","Vehicle theft","Burglary","Robbery","Vandalism","Theft","Burglary","Robbery","Vehicle theft","Theft","Vandalism","Burglary"][index] || "Other",
      dateISO:["2026-10-08","2026-10-05","2026-10-02"][index] || "2026-10-01",
      priority:["High","Medium","Medium"][index] || "Low",
      verification:"Unverified sample",
      status:"Under review"
    }));
    const facilityRecords = sampleIncidents.filter(record => record.type === "facility");
    const allRecords = [...incidentRecords,...facilityRecords];
    const incidentIcon = L.divIcon({className:"crime-marker-wrap",html:'<span class="crime-marker"></span>',iconSize:[13,13],iconAnchor:[6.5,6.5]});
    const facilityIcon = L.divIcon({className:"facility-marker-wrap",html:'<span class="facility-marker"></span>',iconSize:[15,15],iconAnchor:[7.5,7.5]});
    const patrolIcon = L.divIcon({className:"patrol-marker-wrap",html:'<span class="patrol-marker">P</span>',iconSize:[21,21],iconAnchor:[10.5,10.5]});
    const selectedPatrolIcon = L.divIcon({className:"patrol-marker-wrap patrol-marker-selected",html:'<span class="patrol-marker">P</span>',iconSize:[24,24],iconAnchor:[12,12]});

    // Explicitly fictional patrols for the demo; timestamps describe this browser simulation, not GPS telemetry.
    const demoNow = Date.now();
    const patrols = [
      {id:"PATROL-DEMO-01",coords:[13.0788,80.2635],availability:"Available",assignment:"Unassigned",updatedAt:demoNow,label:"Demo update",motion:"Moving",step:0},
      {id:"PATROL-DEMO-02",coords:[13.0905,80.2485],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-6*60*1000,label:"Demo update",motion:"Stationary",step:0},
      {id:"PATROL-DEMO-03",coords:[13.0608,80.2795],availability:"Assigned",assignment:"Existing demo task",updatedAt:demoNow-22*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-04",coords:[13.1035,80.2850],availability:"Offline",assignment:"Unavailable",updatedAt:demoNow-90*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-05",coords:[13.0718,80.2760],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-2*60*1000,label:"Demo update",motion:"Moving",step:0},
      {id:"PATROL-DEMO-06",coords:[13.0861,80.2842],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-4*60*1000,label:"Demo update",motion:"Stationary",step:0},
      {id:"PATROL-DEMO-07",coords:[13.0645,80.2505],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-3*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-08",coords:[13.0955,80.2690],availability:"Assigned",assignment:"Existing demo task",updatedAt:demoNow-8*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-09",coords:[13.0555,80.2675],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-5*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-10",coords:[13.1120,80.2730],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-7*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-11",coords:[13.0750,80.2425],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-1*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-12",coords:[13.0990,80.2580],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-6*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-13",coords:[13.0840,80.2595],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-2*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-14",coords:[13.0732,80.2508],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-4*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-15",coords:[13.0914,80.2788],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-3*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-16",coords:[13.0627,80.2671],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-5*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-17",coords:[13.1012,80.2648],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-3*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-18",coords:[13.0695,80.2840],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-7*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-19",coords:[13.0888,80.2408],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-4*60*1000,label:"Demo update"},
      {id:"PATROL-DEMO-20",coords:[13.0518,80.2579],availability:"Available",assignment:"Unassigned",updatedAt:demoNow-6*60*1000,label:"Demo update"}
    ];
    const patrolState = new Map(patrols.map(p=>[p.id,{...p}]));
    const markerEntries = allRecords.map(record => {
      const marker = L.marker(record.coords,{icon:record.type === "facility" ? facilityIcon : incidentIcon, keyboard:true, riseOnHover:true});
      if(record.type === "incident") {
        const details = incidentRecords.find(item=>item.title===record.title);
        marker.bindPopup(() => {
          const r = details || record;
          return `<div class="gis-popup"><span class="gis-popup-kicker">CRIMEMAP / INCIDENT RECORD</span><strong>${r.id || "SAMPLE RECORD"} · ${r.category || "Incident"}</strong><span class="gis-popup-priority priority-${String(r.priority||"medium").toLowerCase()}">${r.priority || "Sample"} priority</span><div class="gis-popup-row"><span>Location</span><b>${r.title.replace("Sample report · ","")}</b></div><div class="gis-popup-row"><span>Coordinates</span><b>${r.coords[0].toFixed(4)}, ${r.coords[1].toFixed(4)}</b></div><div class="gis-popup-row"><span>Reported</span><b>${r.dateISO || "Sample date"}</b></div><div class="gis-popup-row"><span>Status</span><b>${r.status || "Under review"}</b></div><p>${r.desc}</p><small>Fictional demo data · not an official police record</small></div>`;
        },{maxWidth:290, minWidth:230, closeButton:true, autoPan:true});
        marker.on("click",() => selectIncident(details || record));
      } else {
        marker.bindPopup(`<div class="gis-popup"><span class="gis-popup-kicker">MAP LAYER</span><strong>${record.title}</strong><p>${record.desc}</p><small>Illustrative facility data</small></div>`,{maxWidth:250});
      }
      return {record,marker};
    });
    markerEntries.forEach(entry=>entry.marker.addTo(map));

    // Dashed, illustrative review boundaries around each sample incident.
    const incidentBoundaries = new Map();
    incidentRecords.forEach(record => {
      const boundary = L.circle(record.coords, {
        radius: record.priority === "High" ? 420 : record.priority === "Medium" ? 320 : 240,
        color: record.priority === "High" ? "#e34e45" : "#d9a441",
        weight: 2,
        dashArray: "6 6",
        fillColor: record.priority === "High" ? "#e34e45" : "#d9a441",
        fillOpacity: 0.10,
        interactive: false
      }).addTo(map);
      incidentBoundaries.set(record.id, boundary);
    });
    let nearestPatrolRoute = L.polyline([], {
      color: "#a9d86e", weight: 3, opacity: 0.9, dashArray: "8 7"
    }).addTo(map);

    const patrolMarkers = new Map();
    patrols.forEach(patrol=>{
      const marker=L.marker(patrol.coords,{icon:patrolIcon});
      marker.bindPopup(() => {
        const current = patrolState.get(patrol.id) || patrol;
        return `<div class="gis-popup"><span class="gis-popup-kicker">PATROL UNIT / DEMO</span><strong>${current.id}</strong><div class="gis-popup-row"><span>Motion</span><b>${current.motion || "Stationary"}</b></div><div class="gis-popup-row"><span>Availability</span><b>${current.availability}</b></div><div class="gis-popup-row"><span>Coordinates</span><b>${current.coords[0].toFixed(4)}, ${current.coords[1].toFixed(4)}</b></div><small>Simulated patrol position · not live GPS</small></div>`;
      });
      marker.on("click",()=>{const select=document.getElementById("dispatchPatrolSelect");if(select){select.value=patrol.id;selectedPatrolId=patrol.id;renderPatrols();} });
      marker.addTo(map);patrolMarkers.set(patrol.id,marker);
    });

    // Haversine distance, returned in kilometres; this is not road-route distance.
    function distanceKm(a,b){
      const rad=value=>value*Math.PI/180;
      const dLat=rad(b[0]-a[0]),dLon=rad(b[1]-a[1]);
      const lat1=rad(a[0]),lat2=rad(b[0]);
      const h=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
      return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
    }
    function locationFreshness(patrol){
      const age=Date.now()-patrol.updatedAt;
      if(patrol.availability==="Offline" || age>45*60*1000) return {label:"Offline / stale",className:"freshness-offline"};
      if(age>10*60*1000) return {label:"Delayed",className:"freshness-delayed"};
      return {label:"Recent demo update",className:"freshness-current"};
    }
    const filterButtons=[...document.querySelectorAll("[data-filter]")];
    const markerCount=document.getElementById("markerCount");
    const categoryFilter=document.getElementById("incidentCategoryFilter");
    const dateFilter=document.getElementById("incidentDateFilter");
    const markerSearch=document.getElementById("markerSearch");
    let activeMarkerFilter="all",heatmapOn=false,patrolLayerOn=true,selectedIncident=incidentRecords[0]||null,selectedPatrolId=null,activeDispatch=null;
    let dispatchEvents=[];
    let heatLayer=null;

    function filteredIncidents(){
      const category=categoryFilter?.value||"all",fromDate=dateFilter?.value||"";
      const query=(markerSearch?.value||"").trim().toLowerCase();
      return incidentRecords.filter(record=>(category==="all"||record.category===category)&&(!fromDate||record.dateISO>=fromDate)&&(!query||`${record.title} ${record.kind} ${record.desc} ${record.category} ${record.id}`.toLowerCase().includes(query)));
    }
    function refreshHeatmap(){
      if(heatLayer){map.removeLayer(heatLayer);heatLayer=null;}
      if(heatmapOn && typeof L.heatLayer==="function"){
        const points=filteredIncidents().map(record=>[record.coords[0],record.coords[1],record.priority==="High"?0.85:record.priority==="Medium"?0.6:0.35]);
        if(points.length) heatLayer=L.heatLayer(points,{radius:22,blur:18,maxZoom:16,minOpacity:0.22,gradient:{0.2:"#4d9b73",0.45:"#d9f66f",0.7:"#f3a34b",1:"#d94b4b"}}).addTo(map);
      }
      const heatButton=document.getElementById("heatmapToggle");
      if(heatButton){heatButton.textContent=heatmapOn?"Heatmap: on":"Heatmap: off";heatButton.setAttribute("aria-pressed",String(heatmapOn));}
      const status=document.getElementById("mapStatus");if(status)status.textContent=heatmapOn?(typeof L.heatLayer==="function"?"ILLUSTRATIVE HEATMAP":"HEATMAP LIBRARY UNAVAILABLE"):"● MAP READY";
    }
    function applyMapFilters(){
      const records=filteredIncidents();
      let visible=0;
      markerEntries.forEach(({record,marker})=>{
        const isIncident=record.type==="incident";
        const categoryMatch=!isIncident || records.some(item=>item.id===record.id);
        const search=(markerSearch?.value||"").trim().toLowerCase();
        const searchMatch=!search||`${record.title} ${record.kind} ${record.desc} ${record.category||""}`.toLowerCase().includes(search);
        const show=(activeMarkerFilter==="all"||record.type===activeMarkerFilter)&&categoryMatch&&searchMatch;
        if(show){if(!map.hasLayer(marker))marker.addTo(map);visible++;}else if(map.hasLayer(marker))map.removeLayer(marker);
        if(isIncident){
          const boundary=incidentBoundaries.get(record.id);
          if(boundary){if(show&&!map.hasLayer(boundary))boundary.addTo(map);else if(!show&&map.hasLayer(boundary))map.removeLayer(boundary);}
        }
      });
      filterButtons.forEach(button=>{const active=button.dataset.filter===activeMarkerFilter;button.classList.toggle("is-selected",active);button.setAttribute("aria-pressed",String(active));});
      if(markerCount)markerCount.textContent=`${visible} map marker${visible===1?"":"s"}`;
      refreshHeatmap();
    }
    filterButtons.forEach(button=>button.addEventListener("click",()=>{activeMarkerFilter=button.dataset.filter;applyMapFilters();}));
    [categoryFilter,dateFilter].forEach(el=>el?.addEventListener("change",()=>{applyMapFilters();renderPatrols();}));
    markerSearch?.addEventListener("input",()=>{
      applyMapFilters();const query=markerSearch.value.trim().toLowerCase();
      if(query){const match=markerEntries.find(({record})=>`${record.title} ${record.kind} ${record.desc} ${record.category||""}`.toLowerCase().includes(query));if(match){map.setView(match.marker.getLatLng(),14,{animate:true});match.marker.openPopup();}}
    });
    document.getElementById("heatmapToggle")?.addEventListener("click",()=>{heatmapOn=!heatmapOn;applyMapFilters();});
    document.getElementById("patrolLayerToggle")?.addEventListener("click",event=>{
      patrolLayerOn=!patrolLayerOn;
      patrolMarkers.forEach(marker=>{if(patrolLayerOn){if(!map.hasLayer(marker))marker.addTo(map);}else if(map.hasLayer(marker))map.removeLayer(marker);});
      event.currentTarget.textContent=patrolLayerOn?"Patrols: on":"Patrols: off";event.currentTarget.setAttribute("aria-pressed",String(patrolLayerOn));
    });
    document.getElementById("exportRecords")?.addEventListener("click",()=>{
      const quote=value=>`"${String(value??"").replaceAll('"','""')}"`;
      const rows=[["id","title","category","latitude","longitude","date","priority","verification","data_notice"],...filteredIncidents().map(r=>[r.id,r.title,r.category,r.coords[0],r.coords[1],r.dateISO,r.priority,r.verification,"Illustrative data only"])];
      const blob=new Blob(["\uFEFF",rows.map(row=>row.map(quote).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8;"});
      const url=URL.createObjectURL(blob),anchor=document.createElement("a");anchor.href=url;anchor.download="crimemap-illustrative-incidents.csv";document.body.appendChild(anchor);anchor.click();anchor.remove();URL.revokeObjectURL(url);
    });
    const layerButton=document.getElementById("layerToggle"),layerName=document.getElementById("layerName");let satellite=true;
    layerButton?.addEventListener("click",()=>{if(satellite){map.removeLayer(satelliteLayer);streetLayer.addTo(map);}else{map.removeLayer(streetLayer);satelliteLayer.addTo(map);}satellite=!satellite;layerButton.textContent=satellite?"◈ Satellite view":"▦ Street map";if(layerName)layerName.textContent=satellite?"SATELLITE":"STREET MAP";});
    document.getElementById("resetMap")?.addEventListener("click",()=>map.setView([13.0827,80.2707],12));

    const incidentSelect=document.getElementById("dispatchIncidentSelect"),patrolSelect=document.getElementById("dispatchPatrolSelect");
    const safeText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
    function selectIncident(record){
      if(!record||record.type!=="incident"){
        safeText("incidentTitle",record?.title||"Map record");safeText("incidentDescription",record?.desc||record?.description||"Illustrative map record.");safeText("incidentMeta",`${record?.date||"Sample date"} · fictional data`);document.getElementById("incidentCard")?.classList.add("show");return;
      }
      selectedIncident=record;if(incidentSelect)incidentSelect.value=record.id;
      const selectedMarker=markerEntries.find(entry=>entry.record.id===record.id)?.marker;
      if(selectedMarker){map.panTo(selectedMarker.getLatLng(),{animate:true,duration:.35});selectedMarker.openPopup();}
      safeText("incidentTitle",`${record.id} · ${record.category}`);
      safeText("incidentDescription",`${record.desc} Priority: ${record.priority}. Status: ${record.status}.`);
      safeText("incidentMeta",`${record.date} · ${record.verification} · fictional data`);document.getElementById("incidentCard")?.classList.add("show");
      renderIncidentDetails();renderPatrols();
    }
    function renderIncidentDetails(){
      const target=document.getElementById("dispatchIncidentDetails");if(!target||!selectedIncident)return;
      target.innerHTML=`<div class="detail-row"><span>Incident ID</span><strong>${selectedIncident.id}</strong></div><div class="detail-row"><span>Category</span><strong>${selectedIncident.category}</strong></div><div class="detail-row"><span>Reported date</span><strong>${selectedIncident.dateISO}</strong></div><div class="detail-row"><span>Coordinates</span><strong>${selectedIncident.coords[0].toFixed(4)}, ${selectedIncident.coords[1].toFixed(4)}</strong></div><div class="detail-row"><span>Priority</span><strong>${selectedIncident.priority}</strong></div><div class="detail-row"><span>Verification</span><strong>${selectedIncident.verification}</strong></div><div class="detail-row"><span>Current status</span><strong>${activeDispatch?.incidentId===selectedIncident.id?activeDispatch.status:selectedIncident.status}</strong></div><div class="detail-row"><span>Assigned patrol</span><strong>${activeDispatch?.incidentId===selectedIncident.id?activeDispatch.patrolId:"Not assigned"}</strong></div><p class="dispatch-help">Sample incident. Do not use for operational decisions.</p>`;
    }
    function renderPatrols(){
      const list=document.getElementById("patrolList");if(!list||!selectedIncident)return;
      const ranked=[...patrolState.values()].map(p=>({...p,distance:distanceKm(selectedIncident.coords,p.coords),freshness:locationFreshness(p)})).sort((a,b)=>a.distance-b.distance);
      const eligible=ranked.filter(p=>p.availability==="Available"&&p.freshness.label!=="Offline / stale");
      const nearestId=eligible[0]?.id;
      if(nearestPatrolRoute){
        if(nearestId){
          const nearest=patrolState.get(nearestId);
          nearestPatrolRoute.setLatLngs([selectedIncident.coords, nearest.coords]);
          if(!map.hasLayer(nearestPatrolRoute))nearestPatrolRoute.addTo(map);
        } else {
          nearestPatrolRoute.setLatLngs([]);
        }
      }
      if(!selectedPatrolId&&nearestId)selectedPatrolId=nearestId;
      if(patrolSelect){const previous=patrolSelect.value;patrolSelect.innerHTML=ranked.map(p=>`<option value="${p.id}" ${p.id===(selectedPatrolId||nearestId)?"selected":""}>${p.id} — ${p.availability}</option>`).join("");if(ranked.some(p=>p.id===previous)&&!selectedPatrolId)patrolSelect.value=previous;}
      list.innerHTML=ranked.slice(0,5).map(p=>`<button type="button" class="patrol-row ${p.id===nearestId?"patrol-nearest":""} ${p.id===selectedPatrolId?"patrol-selected":""}" data-patrol-select="${p.id}"><span class="patrol-row-top"><strong>${p.id}</strong>${p.id===nearestId?'<em>NEAREST ELIGIBLE</em>':''}</span><span class="patrol-distance">${p.distance.toFixed(2)} km <small>straight-line · approx.</small></span><span class="patrol-meta"><span>${p.availability}</span><span class="patrol-motion ${p.motion==="Moving"?"motion-moving":"motion-stationary"}">${p.motion || "Stationary"}</span><span>${p.assignment}</span></span><span class="patrol-meta"><span class="${p.freshness.className}">${p.freshness.label}</span><span>Demo timestamp: ${new Date(p.updatedAt).toLocaleTimeString()}</span></span></button>`).join("");
      list.querySelectorAll("[data-patrol-select]").forEach(button=>button.addEventListener("click",()=>{selectedPatrolId=button.dataset.patrolSelect;if(patrolSelect)patrolSelect.value=selectedPatrolId;const patrol=patrolState.get(selectedPatrolId);if(patrol){map.setView(patrol.coords,14,{animate:true});patrolMarkers.get(selectedPatrolId)?.openPopup();}renderPatrols();}));
      safeText("patrolSelectionFeedback",selectedPatrolId?`Selected ${selectedPatrolId}. ${ranked.find(p=>p.id===selectedPatrolId)?.distance.toFixed(2)||"—"} km straight-line distance. Confirm availability before simulated dispatch.`:"No eligible patrol has a recent location.");
    }
    if(incidentSelect){incidentSelect.innerHTML=incidentRecords.map(r=>`<option value="${r.id}">${r.id} · ${r.category} · ${r.priority}</option>`).join("");incidentSelect.addEventListener("change",()=>{const record=incidentRecords.find(r=>r.id===incidentSelect.value);if(record){selectedPatrolId=null;selectIncident(record);const marker=markerEntries.find(e=>e.record.id===record.id)?.marker;if(marker)map.setView(marker.getLatLng(),14,{animate:true});}});}
    patrolSelect?.addEventListener("change",()=>{selectedPatrolId=patrolSelect.value;renderPatrols();});

    // Slow, small movement for two fictional units; other patrols remain stationary.
    // This is only a visual simulation and does not represent real GPS tracking.
    const patrolMotionPaths = {
      "PATROL-DEMO-01": [[13.0788,80.2635],[13.0794,80.2642],[13.0800,80.2638],[13.0795,80.2630]],
      "PATROL-DEMO-05": [[13.0718,80.2760],[13.0723,80.2767],[13.0729,80.2761],[13.0722,80.2754]]
    };
    window.setInterval(() => {
      let moved = false;
      patrols.forEach(patrol => {
        const path = patrolMotionPaths[patrol.id];
        if (!path || patrol.availability === "Offline") return;
        patrol.step = ((patrol.step || 0) + 1) % path.length;
        patrol.coords = path[patrol.step];
        patrol.updatedAt = Date.now();
        patrol.motion = "Moving";
        const marker = patrolMarkers.get(patrol.id);
        if (marker) marker.setLatLng(patrol.coords);
        moved = true;
      });
      if (moved && selectedIncident) renderPatrols();
    }, 5000);

    function renderDispatchTimeline(){
      const target=document.getElementById("dispatchTimeline");if(!target)return;
      target.innerHTML=dispatchEvents.length?dispatchEvents.slice().reverse().map(e=>`<div class="dispatch-event"><time>${new Date(e.at).toLocaleString()}</time><strong>${e.status} · ${e.patrolId}</strong><span>${e.message}</span><small>SIMULATED RADIO EVENT</small></div>`).join(""):'<p class="dispatch-empty">Dispatch events will appear here.</p>';
    }
    function recordDispatchEvent(status,message){
      if(!selectedIncident||!selectedPatrolId){safeText("radioFeedback","Select an incident and patrol first.");return;}
      const patrol=patrolState.get(selectedPatrolId);
      if(!activeDispatch||activeDispatch.incidentId!==selectedIncident.id||activeDispatch.patrolId!==selectedPatrolId){activeDispatch={incidentId:selectedIncident.id,patrolId:selectedPatrolId,status:"Received",events:[]};}
      activeDispatch.status=status;activeDispatch.events.push({status,message,at:Date.now()});dispatchEvents.push({incidentId:selectedIncident.id,patrolId:selectedPatrolId,status,message,at:Date.now()});
      if(status==="En Route"||status==="Arrived"){patrol.availability=status==="Arrived"?"Assigned":"Assigned";patrol.assignment=selectedIncident.id;}
      safeText("radioFeedback",`SIMULATION: ${status} recorded for ${selectedPatrolId}. No real radio message was transmitted.`);
      const ack=document.getElementById("ackRadioDispatch"),update=document.getElementById("updateDispatchStatus");if(ack)ack.disabled=false;if(update)update.disabled=false;
      renderDispatchTimeline();renderIncidentDetails();renderPatrols();
    }
    document.getElementById("sendRadioDispatch")?.addEventListener("click",()=>{
      const patrol=patrolState.get(selectedPatrolId);if(!selectedIncident||!patrol){safeText("radioFeedback","Select an incident and patrol first.");return;}
      if(patrol.availability!=="Available"){safeText("radioFeedback","Choose an available patrol unit before dispatching.");return;}
      const message=document.getElementById("radioMessage");if(message&&!message.value.trim())message.value=`SIMULATED ALERT ${selectedIncident.id}: ${selectedIncident.category}, priority ${selectedIncident.priority}, coordinates ${selectedIncident.coords[0].toFixed(4)}, ${selectedIncident.coords[1].toFixed(4)}. Please acknowledge.`;
      recordDispatchEvent("Received",message?.value.trim()||"Simulated dispatch received.");
    });
    document.getElementById("ackRadioDispatch")?.addEventListener("click",()=>{if(!activeDispatch){safeText("radioFeedback","Send a simulated alert first.");return;}recordDispatchEvent("Acknowledged",`Acknowledgement simulated by ${activeDispatch.patrolId}.`);});
    document.getElementById("updateDispatchStatus")?.addEventListener("click",()=>{if(!activeDispatch){safeText("radioFeedback","Send a simulated alert first.");return;}const status=document.getElementById("dispatchStatusSelect")?.value||"Received";recordDispatchEvent(status,`Dispatcher recorded status: ${status}.`);});
    const closeIncident=document.getElementById("closeIncident");closeIncident?.addEventListener("click",()=>document.getElementById("incidentCard")?.classList.remove("show"));
    applyMapFilters();renderIncidentDetails();renderPatrols();
    window.addEventListener("resize",()=>map.invalidateSize());window.setTimeout(()=>map.invalidateSize(),250);
  }

  // Case Desk prototype: fictional cases and browser-local workflow entries only.
  const sampleCases = [
    {id:"CM-2026-104",date:"2026-10-08",zone:"Central",type:"Theft",status:"Under review",summary:"Fictional report; review source and time window."},
    {id:"CM-2026-098",date:"2026-10-02",zone:"Central",type:"Theft",status:"Closed",summary:"Fictional prior record for comparison only."},
    {id:"CM-2026-091",date:"2026-09-27",zone:"West",type:"Vehicle theft",status:"Under review",summary:"Fictional record; no person is identified."},
    {id:"CM-2026-087",date:"2026-09-20",zone:"North",type:"Burglary",status:"Evidence review",summary:"Fictional record; details require verification."},
    {id:"CM-2026-079",date:"2026-09-11",zone:"East",type:"Robbery",status:"Closed",summary:"Fictional prior record for workflow demonstration."},
    {id:"CM-2026-073",date:"2026-09-03",zone:"Central",type:"Theft",status:"Evidence review",summary:"Fictional report; a similar area/type is not proof of a link."},
    {id:"CM-2026-112",date:"2026-10-10",zone:"North",type:"Murder",status:"Under investigation",summary:"Fictional homicide investigation opened after a reported fatal assault. Scene log, witness accounts and forensic submissions are pending authorised review.",detail:{time:"21:40 (reported)",location:"North Zone · Market Road vicinity (fictional)",report:"A caller reported an injured adult at a public location. Responders documented the scene and transferred the matter for homicide investigation.",evidence:"Scene photographs logged; footwear impressions marked for examination; nearby business CCTV preservation requests drafted.",actions:"Scene secured; witness contact details recorded in the approved system; forensic examination requested.",next:"Await forensic results and verified witness statements. No suspect conclusion is recorded in this sample.",caution:"All details are fictional and are not based on a real person or case."}},
    {id:"CM-2026-109",date:"2026-10-09",zone:"West",type:"Attempted murder",status:"Evidence review",summary:"Fictional serious-assault case with a life-threatening injury allegation. Medical documentation and scene evidence are awaiting authorised cross-check.",detail:{time:"19:15 (reported)",location:"West Zone · Residential lane (fictional)",report:"A report described a serious assault. The legal classification shown is provisional and must be confirmed by authorised investigators.",evidence:"Incident-scene log opened; medical record request pending lawful authorisation; one nearby camera preservation request logged.",actions:"Witness interviews scheduled; chronology prepared from statements received so far.",next:"Verify the sequence of events and await authorised medical and forensic material.",caution:"This is a training record, not a real case or legal determination."}},
    {id:"CM-2026-101",date:"2026-10-05",zone:"East",type:"Murder",status:"Forensic review",summary:"Fictional historical homicide record included to demonstrate evidence registers and review timelines.",detail:{time:"06:25 (reported)",location:"East Zone · Riverside service road (fictional)",report:"A fictional report of a death was referred for investigation. Cause and manner of death are not asserted in this prototype.",evidence:"Scene entry log, property inventory and laboratory submission references are listed as pending review.",actions:"Supervisor review requested; outstanding records assigned for follow-up.",next:"Reconcile laboratory reference numbers with the authorised case file and document any verified findings.",caution:"No real-world event, individual or allegation is represented."}}
  ];
  const safeRead = key => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) { return []; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const caseBody = document.getElementById("caseTableBody");
  const caseSearch = document.getElementById("caseSearch");
  const caseType = document.getElementById("caseType");
  const caseZone = document.getElementById("caseZone");
  function renderCases() {
    if (!caseBody) return;
    const q = (caseSearch?.value || "").trim().toLowerCase();
    const type = caseType?.value || "all";
    const zone = caseZone?.value || "all";
    const rows = sampleCases.filter(c => (type === "all" || c.type === type) && (zone === "all" || c.zone === zone) && `${c.id} ${c.date} ${c.zone} ${c.type} ${c.status}`.toLowerCase().includes(q));
    caseBody.innerHTML = rows.map(c => `<tr tabindex="0" data-case-row="${escapeHTML(c.id)}"><td class="case-ref">${escapeHTML(c.id)}</td><td>${escapeHTML(c.date)}</td><td>${escapeHTML(c.zone)}</td><td>${escapeHTML(c.type)}</td><td><span class="case-status ${/closed/i.test(c.status)?"status-closed":/review|investigation|forensic/i.test(c.status)?"status-review":"status-open"}">${escapeHTML(c.status)}</span></td><td><button type="button" class="review-case" data-case-review="${escapeHTML(c.id)}" aria-expanded="false">Review record</button></td></tr>`).join("") || '<tr><td colspan="6">No sample records match these filters.</td></tr>';
    const count = document.getElementById("caseResultCount");
    if (count) count.textContent = `${rows.length} illustrative record${rows.length === 1 ? "" : "s"} shown. Similarity is a review prompt, not evidence of a link.`;
  }
  [caseSearch, caseType, caseZone].forEach(el => el?.addEventListener("input", renderCases));
  function toggleCaseDetails(caseId, button) {
    const record = sampleCases.find(c => c.id === caseId);
    if (!record) return;
    const existing = caseBody.querySelector(`[data-case-detail-for="${caseId}"]`);
    if (existing) {
      existing.remove();
      button?.setAttribute("aria-expanded", "false");
      if (button) button.textContent = "Review record";
      return;
    }
    caseBody.querySelectorAll("[data-case-detail-for]").forEach(row => row.remove());
    caseBody.querySelectorAll("[data-case-review]").forEach(b => { b.setAttribute("aria-expanded", "false"); b.textContent = "Review record"; });
    const detail = record.detail || {
      time:"Recorded in sample log; exact time requires source verification.",
      location:`${record.zone} Zone (fictional)`,
      report:record.summary,
      evidence:"Refer to the fictional evidence register; no real evidence is represented.",
      actions:"Review source records, preserve lawful material and document verification steps.",
      next:"Confirm facts through authorised procedures before drawing conclusions.",
      caution:"Fictional sample data only. Similarity is not proof of a connection."
    };
    const detailRow = document.createElement("tr");
    detailRow.className = "case-detail-row";
    detailRow.dataset.caseDetailFor = caseId;
    detailRow.innerHTML = `<td colspan="6"><div class="case-detail">
      <div><strong>Case overview</strong><p>${escapeHTML(detail.report)}</p></div>
      <div><strong>Reported time & location</strong><p>${escapeHTML(detail.time)}<br>${escapeHTML(detail.location)}</p></div>
      <div><strong>Evidence register</strong><p>${escapeHTML(detail.evidence)}</p></div>
      <div><strong>Actions recorded</strong><p>${escapeHTML(detail.actions)}</p></div>
      <div class="case-detail-wide"><strong>Next review step</strong><p>${escapeHTML(detail.next)}</p></div>
      <div class="case-detail-wide"><strong>Data integrity notice</strong><p>${escapeHTML(detail.caution)}</p></div>
    </div></td>`;
    const sourceRow = caseBody.querySelector(`[data-case-row="${caseId}"]`);
    sourceRow?.after(detailRow);
    button?.setAttribute("aria-expanded", "true");
    if (button) button.textContent = "Hide details";
  }
  caseBody?.addEventListener("click", event => {
    const button = event.target.closest("[data-case-review]");
    const row = event.target.closest("[data-case-row]");
    if (button) {
      event.stopPropagation();
      toggleCaseDetails(button.dataset.caseReview, button);
    } else if (row && !event.target.closest("button")) {
      const id = row.dataset.caseRow;
      toggleCaseDetails(id, row.querySelector("[data-case-review]"));
    }
  });
  caseBody?.addEventListener("keydown", event => {
    const row = event.target.closest("[data-case-row]");
    if (row && (event.key === "Enter" || event.key === " ") && event.target === row) {
      event.preventDefault();
      toggleCaseDetails(row.dataset.caseRow, row.querySelector("[data-case-review]"));
    }
  });
  renderCases();

  function renderEvidence() {
    const target = document.getElementById("evidenceList"); if (!target) return;
    const items = safeRead("crimemapEvidencePrototype").slice(-4).reverse();
    target.innerHTML = items.map(item => `<div class="evidence-item"><strong>${escapeHTML(item.caseRef)} · ${escapeHTML(item.category)}</strong><span>Item: ${escapeHTML(item.itemRef)} · ${escapeHTML(item.created)}</span><span>${escapeHTML(item.notes)}</span></div>`).join("");
  }
  document.getElementById("evidenceForm")?.addEventListener("submit", event => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const item = {caseRef:data.get("caseRef").trim(),category:data.get("category"),itemRef:data.get("itemRef").trim(),notes:data.get("notes").trim(),created:new Date().toLocaleString()};
    const items = safeRead("crimemapEvidencePrototype"); items.push(item);
    const ok = safeWrite("crimemapEvidencePrototype", items);
    const feedback = document.getElementById("evidenceFeedback");
    if (feedback) feedback.textContent = ok ? "Added to this browser's local prototype register. Not saved to an official evidence system." : "Browser storage is unavailable; entry was not saved.";
    if (ok) { form.reset(); renderEvidence(); addTimelineEntry({caseRef:item.caseRef,activity:"Evidence logged",note:`Local register entry: ${item.itemRef}`,created:new Date().toLocaleString()}); }
  });
  renderEvidence();

  function renderRequests() {
    const target = document.getElementById("cameraRequestList"); if (!target) return;
    target.innerHTML = safeRead("crimemapCameraRequestsPrototype").slice(-4).reverse().map(item => `<div class="request-item"><strong>${escapeHTML(item.caseRef)} · ${escapeHTML(item.status)}</strong><span>Camera/location ref: ${escapeHTML(item.cameraRef)}</span><span>Requested window: ${escapeHTML(item.timeWindow)}</span><span>Logged: ${escapeHTML(item.created)}</span></div>`).join("");
  }
  document.getElementById("cameraForm")?.addEventListener("submit", event => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    const item = {caseRef:data.get("caseRef").trim(),cameraRef:data.get("cameraRef").trim(),timeWindow:data.get("timeWindow").trim(),status:data.get("status"),created:new Date().toLocaleString()};
    const items = safeRead("crimemapCameraRequestsPrototype"); items.push(item);
    const ok = safeWrite("crimemapCameraRequestsPrototype", items);
    const feedback = document.getElementById("cameraFeedback");
    if (feedback) feedback.textContent = ok ? "Request logged locally. Actual footage access requires lawful authorisation through official channels." : "Browser storage is unavailable; request was not saved.";
    if (ok) { form.reset(); renderRequests(); addTimelineEntry({caseRef:item.caseRef,activity:"CCTV request submitted",note:`${item.cameraRef} · ${item.status}`,created:new Date().toLocaleString()}); }
  });
  renderRequests();

  function addTimelineEntry(item) {
    const items = safeRead("crimemapTimelinePrototype"); items.push(item); safeWrite("crimemapTimelinePrototype", items); renderTimeline();
  }
  function renderTimeline() {
    const target = document.getElementById("timelineList"); if (!target) return;
    target.innerHTML = safeRead("crimemapTimelinePrototype").slice(-8).reverse().map(item => `<div class="timeline-item"><time>${escapeHTML(item.created)}</time><div><strong>${escapeHTML(item.caseRef)} · ${escapeHTML(item.activity)}</strong><span>${escapeHTML(item.note)}</span></div></div>`).join("") || '<p class="desk-footnote">No local activity entries yet. Add an entry to demonstrate the review timeline.</p>';
  }
  document.getElementById("timelineForm")?.addEventListener("submit", event => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    addTimelineEntry({caseRef:data.get("caseRef").trim(),activity:data.get("activity"),note:data.get("note").trim(),created:new Date().toLocaleString()});
    event.currentTarget.reset();
  });
  renderTimeline();
});
