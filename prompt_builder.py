from schemas import Intent


def build_prompt(intent: Intent) -> str:
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
