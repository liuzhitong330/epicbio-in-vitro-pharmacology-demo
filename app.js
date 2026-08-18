(function () {
  "use strict";
  const data = window.EPICBIO_DEMO_DATA;
  const $ = (id) => document.getElementById(id);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

  function updateChain() {
    const values = {
      delivery: clamp($("delivery-input").value, 0, 1000),
      chromatin: clamp($("methylation-input").value, -100, 100),
      transcript: clamp($("dux4-input").value, 0, 100),
      phenotype: clamp($("apoptosis-input").value, -100, 100)
    };
    const g = data.planningGates;
    const stages = [
      { key: "delivery", label: "AAV delivery", pass: values.delivery >= g.deliveryVgPerDg },
      { key: "chromatin", label: "D4Z4 methylation", pass: values.chromatin >= g.methylationDeltaPoints },
      { key: "transcript", label: "DUX4 suppression", pass: values.transcript >= g.dux4SuppressionPct },
      { key: "phenotype", label: "cell rescue", pass: values.phenotype >= g.apoptosisReductionPct }
    ];
    stages.forEach((stage) => {
      const node = document.querySelector(`[data-step="${stage.key}"]`);
      node.classList.toggle("fail", !stage.pass);
    });
    const failed = stages.filter((stage) => !stage.pass);
    $("stages-passed").textContent = `${stages.length - failed.length} / ${stages.length}`;
    $("weak-link").textContent = failed.length ? failed[0].label : "None";
    const isPass = failed.length === 0;
    $("chain-status").textContent = isPass ? "Mechanism chain is coherent" : "Mechanism chain needs resolution";
    $("chain-badge").textContent = isPass ? "Advance" : "Hold";
    $("chain-badge").className = `status-badge ${isPass ? "pass" : "hold"}`;

    let next = "Durability";
    let action = "Carry the candidate into a longer time course and verify that D4Z4 methylation, DUX4 suppression, and the phenotype remain aligned.";
    if (failed.length) {
      const first = failed[0].key;
      if (first === "delivery") {
        next = "Delivery / cargo";
        action = "Repeat vector-genome dPCR and dCasONYX RT-qPCR before interpreting downstream molecular or phenotypic readouts.";
      } else if (first === "chromatin") {
        next = "Locus engagement";
        action = "Delivery is adequate, but the proposed mechanism is weak. Confirm guide-dependent D4Z4 engagement and targeted methylation depth.";
      } else if (first === "transcript") {
        next = "Time-course RT-qPCR";
        action = "The locus changed without sufficient DUX4 suppression. Add differentiation timepoints and the six-gene DUX4 pathway panel.";
      } else {
        next = "Phenotype depth";
        action = "The molecular chain is intact but cell rescue is weak. Extend Caspase imaging and add 3D twitch and tetanic force before advancing.";
      }
    }
    $("next-experiment").textContent = next;
    $("chain-action").textContent = action;
  }

  function updateDesign() {
    const donors = clamp($("donor-count").value, 1, 12);
    const doses = clamp($("dose-count").value, 2, 8);
    const controls = clamp($("control-count").value, 1, 4);
    const reps = clamp($("replicate-count").value, 1, 4);
    const timepoints = clamp($("timepoint-count").value, 1, 5);
    const cellsPerWell = clamp($("cells-per-well").value, 5000, 150000);
    const readouts = document.querySelectorAll(".readout-choice:checked").length;
    const wells = donors * (doses + controls) * reps * timepoints;
    const plates = Math.ceil(wells / 96);
    const cellsM = wells * cellsPerWell / 1000000;
    const measurements = wells * readouts;
    $("culture-wells").textContent = wells.toLocaleString();
    $("culture-plates").textContent = plates.toLocaleString();
    $("cells-required").textContent = `${cellsM.toFixed(1)} M`;
    $("measurement-count").textContent = measurements.toLocaleString();

    const donorText = donors >= 6
      ? `${donors} donors preserve${donors === 6 ? "" : " or exceed"} the donor breadth in Epicrispr’s detailed public in-vitro panel.`
      : `${donors} donors are fewer than the six used in Epicrispr’s detailed public in-vitro panel, so donor-specific effects will be harder to separate.`;
    const controlText = controls >= 2
      ? `${controls} controls can include vehicle and a non-targeting editor while ${doses} doses estimate potency.`
      : "A single control cannot independently separate AAV exposure from guide-dependent editing; add a non-targeting editor.";
    $("design-interpretation").textContent = `${donorText} ${controlText} ${timepoints > 1 ? `${timepoints} destructive timepoints test durability but require independent culture wells.` : "The single destructive endpoint is compact but does not test durability."}`;
  }

  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = data.presets[button.dataset.preset];
      $("delivery-input").value = preset.delivery;
      $("methylation-input").value = preset.methylation;
      $("dux4-input").value = preset.dux4;
      $("apoptosis-input").value = preset.apoptosis;
      document.querySelectorAll("[data-preset]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      updateChain();
    });
  });

  document.querySelectorAll("[data-timeline]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = data.timeline[button.dataset.timeline];
      document.querySelectorAll("[data-timeline]").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      $("timeline-label").textContent = item.label;
      $("timeline-action").textContent = item.action;
    });
  });

  ["delivery-input", "methylation-input", "dux4-input", "apoptosis-input"].forEach((id) => $(id).addEventListener("input", updateChain));
  ["donor-count", "dose-count", "control-count", "replicate-count", "timepoint-count", "cells-per-well"].forEach((id) => $(id).addEventListener("input", updateDesign));
  document.querySelectorAll(".readout-choice").forEach((input) => input.addEventListener("change", updateDesign));

  updateChain();
  updateDesign();
})();
