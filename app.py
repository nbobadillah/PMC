import streamlit as st

st.set_page_config(
    page_title="Asistente de Tarifas Freelance",
    page_icon="💼",
    layout="wide",
)


def inject_styles() -> None:
    st.markdown(
        """
        <style>
            .stApp {
                background:
                    radial-gradient(circle at top left, rgba(26, 86, 219, 0.18), transparent 28%),
                    radial-gradient(circle at top right, rgba(8, 145, 178, 0.16), transparent 24%),
                    linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%);
            }
            .block-container {
                padding-top: 2rem;
                padding-bottom: 2rem;
                max-width: 1180px;
            }
            h1, h2, h3 {
                color: #10233f;
                letter-spacing: -0.02em;
            }
            .hero-card,
            .panel-card,
            .metric-card,
            .info-card {
                background: rgba(255, 255, 255, 0.88);
                border: 1px solid rgba(148, 163, 184, 0.22);
                box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08);
                backdrop-filter: blur(10px);
            }
            .hero-card {
                padding: 1.6rem 1.8rem;
                border-radius: 24px;
                margin-bottom: 1rem;
            }
            .hero-kicker {
                color: #0f766e;
                font-weight: 700;
                text-transform: uppercase;
                font-size: 0.78rem;
                letter-spacing: 0.08em;
                margin-bottom: 0.5rem;
            }
            .hero-title {
                font-size: 2.4rem;
                line-height: 1.05;
                font-weight: 800;
                color: #10233f;
                margin-bottom: 0.75rem;
            }
            .hero-copy {
                color: #425466;
                font-size: 1rem;
                margin-bottom: 1.25rem;
            }
            .pill-row {
                display: flex;
                flex-wrap: wrap;
                gap: 0.65rem;
            }
            .pill {
                padding: 0.55rem 0.9rem;
                border-radius: 999px;
                background: #e0f2fe;
                color: #0f172a;
                font-size: 0.9rem;
                font-weight: 600;
            }
            .panel-card {
                padding: 1.3rem 1.35rem;
                border-radius: 22px;
                margin-bottom: 1rem;
            }
            .section-label {
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                font-weight: 700;
                color: #64748b;
                margin-bottom: 0.35rem;
            }
            .section-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #10233f;
                margin-bottom: 0.35rem;
            }
            .section-copy {
                color: #475569;
                margin-bottom: 0;
            }
            .metric-card {
                padding: 1.15rem 1.2rem;
                border-radius: 20px;
                min-height: 150px;
            }
            .metric-label {
                color: #64748b;
                font-size: 0.84rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                font-weight: 700;
                margin-bottom: 0.7rem;
            }
            .metric-value {
                color: #0f172a;
                font-size: 2rem;
                font-weight: 800;
                line-height: 1.1;
                margin-bottom: 0.45rem;
            }
            .metric-note {
                color: #475569;
                font-size: 0.95rem;
            }
            .info-card {
                padding: 1.15rem 1.2rem;
                border-radius: 18px;
                margin-top: 0.75rem;
            }
            .info-title {
                font-size: 0.95rem;
                font-weight: 700;
                color: #10233f;
                margin-bottom: 0.45rem;
            }
            .formula-list {
                margin: 0;
                padding-left: 1rem;
                color: #475569;
            }
            .formula-list li {
                margin-bottom: 0.35rem;
            }
            div[data-testid="stRadio"] > label,
            div[data-testid="stSelectbox"] label,
            div[data-testid="stNumberInput"] label {
                font-weight: 600;
                color: #1e293b;
            }
            .stButton > button {
                width: 100%;
                border-radius: 14px;
                border: 0;
                background: linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%);
                color: white;
                font-weight: 700;
                padding: 0.7rem 1rem;
                box-shadow: 0 10px 25px rgba(29, 78, 216, 0.22);
            }
            .stButton > button:hover {
                filter: brightness(1.04);
            }
            div[data-testid="stChatMessage"] {
                background: rgba(255, 255, 255, 0.74);
                border: 1px solid rgba(148, 163, 184, 0.18);
                border-radius: 18px;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )


def base_rate(service: str) -> float:
    return {
        "Diseno": 30,
        "Desarrollo": 40,
        "Consultoria": 50,
        "Marketing": 35,
        "Fotografia/Video": 45,
    }.get(service, 35)


def mult_experience(exp: str) -> float:
    return {
        "0-1 anos (Junior)": 0.8,
        "2-4 anos (Semi)": 1.0,
        "5+ anos (Senior)": 1.3,
    }.get(exp, 1.0)


def mult_complexity(comp: str) -> float:
    return {
        "Baja": 1.0,
        "Media": 1.2,
        "Alta": 1.5,
    }.get(comp, 1.0)


def mult_market(market: str) -> float:
    return {
        "Local": 1.0,
        "Internacional": 1.4,
    }.get(market, 1.0)


def compute_range(hourly: float) -> tuple[float, float]:
    low = hourly * 0.88
    high = hourly * 1.12
    return round(low, 2), round(high, 2)


def negotiation_script(service, exp, comp, market, low, high, currency="USD"):
    return (
        f"Con base en mi experiencia ({exp}), el alcance del proyecto ({comp}) y el mercado ({market}), "
        f"la tarifa justa para este trabajo esta en el rango de {low} a {high} {currency}/hora. "
        "Este rango cubre ejecucion, revisiones y el nivel de calidad esperado del entregable. "
        "Si necesitamos ajustar presupuesto, puedo proponer alternativas como reducir alcance, "
        "disminuir iteraciones o extender tiempos para optimizar costos."
    )


inject_styles()

if "step" not in st.session_state:
    st.session_state.step = 0
if "answers" not in st.session_state:
    st.session_state.answers = {}
if "chat" not in st.session_state:
    st.session_state.chat = []

questions = [
    ("servicio", "Que tipo de servicio es?", ["Diseno", "Desarrollo", "Consultoria", "Marketing", "Fotografia/Video"]),
    ("experiencia", "Cuanta experiencia tiene el profesional?", ["0-1 anos (Junior)", "2-4 anos (Semi)", "5+ anos (Senior)"]),
    ("complejidad", "Que tan complejo es el proyecto?", ["Baja", "Media", "Alta"]),
    ("mercado", "Donde se ejecuta o compite el trabajo?", ["Local", "Internacional"]),
    ("horas", "Cuantas horas estimas que tomara?", None),
]

st.markdown(
    """
    <div class="hero-card">
        <div class="hero-kicker">Tarifas con criterio</div>
        <div class="hero-title">Calcula una tarifa freelance con una presentacion mas profesional</div>
        <div class="hero-copy">
            Este asistente estima un rango por hora y por proyecto a partir de servicio, experiencia,
            complejidad y mercado. El resultado queda listo para usar en una conversacion comercial.
        </div>
        <div class="pill-row">
            <div class="pill">Benchmark rapido</div>
            <div class="pill">Guion de negociacion</div>
            <div class="pill">Vista para freelancer y empresa</div>
        </div>
    </div>
    """,
    unsafe_allow_html=True,
)

top_left, top_right = st.columns([1.45, 1], gap="large")

with top_left:
    st.markdown(
        """
        <div class="panel-card">
            <div class="section-label">Configuracion</div>
            <div class="section-title">Modo de uso</div>
            <p class="section-copy">Selecciona el perfil que usara la herramienta para ajustar el tono de la recomendacion.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    mode = st.radio(
        "Quien esta usando el asistente?",
        ["Freelancer (B2C)", "Empresa que contrata (B2B)"],
        horizontal=True,
        label_visibility="collapsed",
    )
    st.session_state.answers["modo"] = mode

with top_right:
    current_step = min(st.session_state.step + 1, len(questions))
    st.markdown(
        f"""
        <div class="panel-card">
            <div class="section-label">Progreso</div>
            <div class="section-title">Formulario guiado</div>
            <p class="section-copy">Paso {current_step} de {len(questions)}. Responde lo esencial y el sistema arma una recomendacion defensible.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

left_col, right_col = st.columns([1.3, 0.9], gap="large")

with left_col:
    st.markdown(
        """
        <div class="panel-card">
            <div class="section-label">Conversacion</div>
            <div class="section-title">Asistente de estimacion</div>
            <p class="section-copy">Completa el flujo y revisa la recomendacion final en el panel derecho.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    for role, msg in st.session_state.chat:
        with st.chat_message(role):
            st.write(msg)

    if st.session_state.step < len(questions):
        key, qtext, options = questions[st.session_state.step]

        with st.chat_message("assistant"):
            st.write(qtext)

        form_key = f"form_{key}"
        with st.form(form_key):
            if options:
                answer = st.selectbox("Selecciona una opcion", options, key=f"sel_{key}")
            else:
                answer = st.number_input(
                    "Horas estimadas",
                    min_value=1,
                    max_value=500,
                    value=10,
                    step=1,
                    key="hours_input",
                )

            submitted = st.form_submit_button("Continuar")

        if submitted:
            value = int(answer) if key == "horas" else answer
            st.session_state.answers[key] = value
            st.session_state.chat.append(("assistant", qtext))
            st.session_state.chat.append(("user", str(value)))
            st.session_state.step += 1
            st.rerun()
    else:
        st.success("Formulario completo. Revisa la recomendacion en el panel lateral.")

with right_col:
    st.markdown(
        """
        <div class="panel-card">
            <div class="section-label">Resultado</div>
            <div class="section-title">Resumen ejecutivo</div>
            <p class="section-copy">Aqui aparece el rango sugerido, la justificacion comercial y la logica del calculo.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if st.session_state.step >= len(questions):
        servicio = st.session_state.answers["servicio"]
        experiencia = st.session_state.answers["experiencia"]
        complejidad = st.session_state.answers["complejidad"]
        mercado = st.session_state.answers["mercado"]
        horas = st.session_state.answers["horas"]

        base = base_rate(servicio)
        hourly = base * mult_experience(experiencia) * mult_complexity(complejidad) * mult_market(mercado)
        low, high = compute_range(hourly)
        total_low = round(low * horas, 2)
        total_high = round(high * horas, 2)

        metric_1, metric_2 = st.columns(2, gap="medium")
        with metric_1:
            st.markdown(
                f"""
                <div class="metric-card">
                    <div class="metric-label">Tarifa sugerida</div>
                    <div class="metric-value">{low} - {high}</div>
                    <div class="metric-note">USD por hora para una propuesta competitiva.</div>
                </div>
                """,
                unsafe_allow_html=True,
            )
        with metric_2:
            st.markdown(
                f"""
                <div class="metric-card">
                    <div class="metric-label">Presupuesto estimado</div>
                    <div class="metric-value">{total_low} - {total_high}</div>
                    <div class="metric-note">USD totales para {horas} horas de trabajo.</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.markdown(
            f"""
            <div class="info-card">
                <div class="info-title">Justificacion para cliente</div>
                <div>{negotiation_script(servicio, experiencia, complejidad, mercado, low, high)}</div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown(
            f"""
            <div class="info-card">
                <div class="info-title">Como se calculo</div>
                <ul class="formula-list">
                    <li>Base del servicio <strong>{servicio}</strong>: <strong>{base} USD/h</strong></li>
                    <li>Experiencia <strong>{experiencia}</strong>: <strong>x{mult_experience(experiencia)}</strong></li>
                    <li>Complejidad <strong>{complejidad}</strong>: <strong>x{mult_complexity(complejidad)}</strong></li>
                    <li>Mercado <strong>{mercado}</strong>: <strong>x{mult_market(mercado)}</strong></li>
                    <li>Tarifa central estimada: <strong>{round(hourly, 2)} USD/h</strong> con rango de ajuste del 12%</li>
                </ul>
            </div>
            """,
            unsafe_allow_html=True,
        )

        if mode.startswith("Empresa"):
            st.markdown(
                """
                <div class="info-card">
                    <div class="info-title">Lectura para empresa</div>
                    <div>Este rango sirve como referencia para presupuestar con mayor consistencia, reducir friccion en negociacion y alinear expectativas con el nivel del talento contratado.</div>
                </div>
                """,
                unsafe_allow_html=True,
            )

        if st.button("Reiniciar prototipo"):
            st.session_state.step = 0
            st.session_state.answers = {}
            st.session_state.chat = []
            st.rerun()
    else:
        st.markdown(
            """
            <div class="info-card">
                <div class="info-title">Esperando datos</div>
                <div>Completa las preguntas del asistente para generar el rango recomendado y la justificacion comercial.</div>
            </div>
            """,
            unsafe_allow_html=True,
        )
