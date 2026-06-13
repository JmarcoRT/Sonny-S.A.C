import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10
  },

  topBar: {
    height: 55,
    backgroundColor: "#DDEEEE"
  },

  content: {
    paddingHorizontal: 45,
    paddingTop: 25,
    paddingBottom: 30
  },

  // ========================
  // CABECERA
  // ========================

  CABECERA: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25
  },

  logo: {
    width: 90,
    height: 90,
    marginRight: 18
  },

  titleContainer: {
    justifyContent: "center"
  },

  title: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.1
  },

  subtitle: {
    marginTop: 8,
    fontSize: 11,
    color: "#444",
    fontStyle: "italic"
  },

  // ========================
  // DATOS DEL PACIENTE
  // ========================

  patientSection: {
    marginBottom: 20
  },

  patientRow: {
    flexDirection: "row",
    marginBottom: 10
  },

  patientColumn: {
    width: "50%"
  },

  label: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    marginBottom: 3
  },

  value: {
    fontSize: 10
  },

  divider: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    marginBottom: 20
  },

  // ========================
  // TITULOS
  // ========================

  sectionTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10
  },

  // ========================
  // TABLA EVALUACION
  // ========================

  table: {
    borderWidth: 1,
    borderColor: "#4EA4E7",
    marginBottom: 15
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#4EA4E7"
  },

  tableLabelCell: {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: "#4EA4E7",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center"
  },

  tableLabelText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10
  },

  tableValueCell: {
    width: "60%",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center"
  },

  tableValueText: {
    fontSize: 10
  },

  // ========================
  // IMC
  // ========================

  imcRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4EA4E7",
    marginBottom: 20,
    backgroundColor: "#EBF5FB" // Fondo medio celestito
  },

  imcCell: {
    flex: 1,
    paddingVertical: 8,
    borderRightWidth: 1,
    borderRightColor: "#4EA4E7",
    justifyContent: "center",
    alignItems: "center"
  },

  imcStatusCell: {
    flex: 1,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center"
  },

  imcTextBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10
  },

  imcText: {
    fontSize: 10
  },

  // ========================
  // INDICACIONES NUTRICIONALES
  // ========================

  notesContainer: {
    borderWidth: 1,
    borderColor: "#4EA4E7",
    minHeight: 120, // Reducido para evitar saltos de página
    display: "flex",
    flexDirection: "column"
  },

  notesBody: {
    flexGrow: 1,
    padding: 10
  },

  notesText: {
    fontSize: 11,
    color: "#222",
  },
  
  notesTextEmpty: {
    fontSize: 11,
    color: "#888",
    fontStyle: "italic"
  },

  // ========================
  // FECHA CONTROL
  // ========================

  nextControlRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#4EA4E7",
    minHeight: 28,
    alignItems: "center"
  },

  nextControlLabel: {
    width: "45%",
    paddingLeft: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 10
  },

  nextControlValue: {
    width: "55%",
    fontSize: 10
  }
});

export const ReportePDF = ({ evaluacion }: { evaluacion: any }) => {
  const paciente = evaluacion?.paciente || {};
  
  // Separar apellidos
  const apellidosParts = paciente.apellido ? paciente.apellido.split(' ') : [];
  const apellidoPaterno = apellidosParts[0] || "-";
  const apellidoMaterno = apellidosParts.slice(1).join(' ') || "-";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Franja superior */}
        <View style={styles.topBar} />

        <View style={styles.content}>
          {/* CABECERA */}
          <View style={styles.CABECERA}>
            <Image
              src="/logo.svg"
              style={styles.logo}
            />

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Ficha de</Text>
              <Text style={styles.title}>Evaluación</Text>

              <Text style={styles.subtitle}>
                Médico evaluador: {evaluacion.medicoNombre || "Médico Nutricionista"}
              </Text>
            </View>
          </View>

          {/* DATOS DEL PACIENTE */}

          <View style={styles.patientSection}>
            <View style={styles.patientRow}>
              <View style={styles.patientColumn}>
                <Text style={styles.label}>APELLIDO PATERNO:</Text>
                <Text style={styles.value}>
                  {apellidoPaterno}
                </Text>
              </View>

              <View style={styles.patientColumn}>
                <Text style={styles.label}>APELLIDO MATERNO:</Text>
                <Text style={styles.value}>
                  {apellidoMaterno === "-" && apellidosParts.length === 1 ? "-" : apellidoMaterno}
                </Text>
              </View>
            </View>

            <View style={styles.patientRow}>
              <View style={styles.patientColumn}>
                <Text style={styles.label}>NOMBRES:</Text>
                <Text style={styles.value}>
                  {paciente.nombre || "-"}
                </Text>
              </View>

              <View style={styles.patientColumn}>
                <Text style={styles.label}>
                  FECHA DE EVALUACIÓN:
                </Text>
                <Text style={styles.value}>
                  {evaluacion.fecha || "-"}
                </Text>
              </View>
            </View>

            <View style={styles.patientRow}>
              <View style={styles.patientColumn}>
                <Text style={styles.label}>N° DE DOCUMENTO:</Text>
                <Text style={styles.value}>
                  {paciente.documento || "-"}
                </Text>
              </View>

              <View style={styles.patientColumn}>
                <Text style={styles.label}>EDAD:</Text>
                <Text style={styles.value}>
                  {paciente.edad || "-"}
                </Text>
              </View>
            </View>

            <View style={styles.patientRow}>
              <View style={styles.patientColumn}>
                <Text style={styles.label}>SEXO:</Text>
                <Text style={styles.value}>
                  {paciente.sexo ? paciente.sexo.toUpperCase() : "-"}
                </Text>
              </View>

              <View style={styles.patientColumn}>
                <Text style={styles.label}>TELÉFONO:</Text>
                <Text style={styles.value}>
                  {paciente.telefono || "-"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* EVALUACION */}

          <Text style={styles.sectionTitle}>
            Evaluación del Paciente
          </Text>

          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableLabelCell}>
                <Text style={styles.tableLabelText}>PESO</Text>
              </View>
              <View style={styles.tableValueCell}>
                <Text style={styles.tableValueText}>{evaluacion.peso} kg</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableLabelCell}>
                <Text style={styles.tableLabelText}>TALLA</Text>
              </View>
              <View style={styles.tableValueCell}>
                <Text style={styles.tableValueText}>{evaluacion.talla} cm</Text>
              </View>
            </View>

            <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View style={styles.tableLabelCell}>
                <Text style={styles.tableLabelText}>PERÍMETRO ABDOMINAL</Text>
              </View>
              <View style={styles.tableValueCell}>
                <Text style={styles.tableValueText}>{evaluacion.perimetroAbdominal} cm</Text>
              </View>
            </View>
          </View>

          {/* IMC */}

          <View style={styles.imcRow}>
            <View style={styles.imcCell}>
              <Text style={styles.imcTextBold}>IMC</Text>
            </View>

            <View style={styles.imcCell}>
              <Text style={styles.imcText}>{evaluacion.imc}</Text>
            </View>

            <View style={styles.imcStatusCell}>
              <Text style={styles.imcTextBold}>
                {evaluacion.clasificacionImc ? evaluacion.clasificacionImc.toUpperCase() : ""}
              </Text>
            </View>
          </View>

          {/* INDICACIONES NUTRICIONALES */}

          <Text style={styles.sectionTitle}>
            Indicaciones Nutricionales
          </Text>

          <View style={styles.notesContainer}>
            <View style={styles.notesBody}>
              <Text style={evaluacion.indicaciones ? styles.notesText : styles.notesTextEmpty}>
                {evaluacion.indicaciones || ""}
              </Text>
            </View>

            <View style={styles.nextControlRow}>
              <Text style={styles.nextControlLabel}>
                FECHA DE PRÓXIMO CONTROL
              </Text>

              <Text style={styles.nextControlValue}>
                {evaluacion.fechaProximoControl || "-"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
