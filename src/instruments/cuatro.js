export const cuatro = {
  id: "cuatro",
  label: "Puerto Rican Cuatro",
  maxFret: 20,
  stringLabel: "Course",
  courseOrderText: "B E A D G",
  pairingText: "B/E octave courses; A/D/G unison courses",
  strings: [
    { name: "G", label: "G4/G4", pairing: "unison", midi: 67, gauge: 1.2 },
    { name: "D", label: "D4/D4", pairing: "unison", midi: 62, gauge: 1.7 },
    { name: "A", label: "A3/A3", pairing: "unison", midi: 57, gauge: 2.3 },
    { name: "E", label: "E4/E3", pairing: "octave", midi: 52, gauge: 3.1 },
    { name: "B", label: "B3/B2", pairing: "octave", midi: 47, gauge: 4 }
  ],
  lowToHigh: [4, 3, 2, 1, 0],
  markerFrets: [3, 5, 7, 9, 15, 17, 19],
  doubleMarkerFrets: [12],
  voicingGroups: [
    { id: "upper", title: "Upper set", detail: "A D G courses", courseOrder: [2, 1, 0], threeCourse: true, limit: 6 },
    { id: "lower", title: "Lower set", detail: "B E A courses", courseOrder: [4, 3, 2], threeCourse: true, limit: 6 },
    { id: "full", title: "Full five-course", detail: "B E A D G", courseOrder: [4, 3, 2, 1, 0], threeCourse: false, limit: 6 },
    { id: "compact", title: "Compact movable", detail: "Shortest complete grips", courseOrder: [4, 3, 2, 1, 0], threeCourse: false, limit: 8, compact: true }
  ]
};
