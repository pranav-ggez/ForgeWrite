from schemas import PersonaIntent


def build_persona_prompt(intent: PersonaIntent) -> str:
    return f"""
ROLE:
You are a {intent.role}.

TARGET AUDIENCE:
{intent.audience}

EXPERTISE LEVEL:
{intent.expertise_level}

BEHAVIOR:
{intent.behavior}

TONE:
{intent.tone}

OUTPUT STYLE:
{intent.output_style}

CONSTRAINTS:
{intent.constraints}

TASK:
{intent.task}
""".strip()
