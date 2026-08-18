window.EPICBIO_DEMO_DATA = {
  publicSummary: {
    detailedDonors: 6,
    widerCohort: 10,
    dux4SuppressionPctLowerBound: 50,
    d4z4MethylationDeltaPoints: 8.5,
    apoptosisAucReductionPct: 25,
    engineeredMuscleDays: 46
  },
  planningGates: {
    deliveryVgPerDg: 5,
    methylationDeltaPoints: 5,
    dux4SuppressionPct: 50,
    apoptosisReductionPct: 20
  },
  presets: {
    public: { delivery: 12, methylation: 8.5, dux4: 50, apoptosis: 25 },
    delivery: { delivery: 2, methylation: 1.5, dux4: 12, apoptosis: 4 },
    mechanism: { delivery: 12, methylation: 1.2, dux4: 9, apoptosis: 3 },
    phenotype: { delivery: 12, methylation: 8.5, dux4: 61, apoptosis: 5 }
  },
  timeline: {
    delivery: {
      label: "If delivery is weak",
      action: "Repeat vector-genome dPCR alongside dCasONYX RT-qPCR. If both are low, optimize AAV exposure or cell state before interpreting DUX4."
    },
    cargo: {
      label: "If vector genomes are present but cargo RNA is weak",
      action: "Compare promoter activity and RNA integrity across donors. Delivery succeeded, so the next question is whether the compact cargo is expressed and stable."
    },
    mechanism: {
      label: "If cargo is present but D4Z4 does not remethylate",
      action: "Confirm guide-dependent locus engagement and targeted methylation depth before expanding the dose range or measuring distal phenotypes."
    },
    transcript: {
      label: "If D4Z4 remethylates but DUX4 remains high",
      action: "Measure DUX4 and its six downstream genes across differentiation timepoints. A temporal mismatch can separate incomplete silencing from an assay-timing problem."
    },
    function: {
      label: "If DUX4 falls but muscle rescue lags",
      action: "Extend longitudinal Caspase 3/7 imaging and pair it with twitch and tetanic force. The molecular effect may be real but insufficient, delayed, or donor-dependent."
    }
  }
};
