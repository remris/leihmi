import { createInventoryItem } from "@/app/actions/inventory"

export default function NewInventoryItemPage() {
    return (
        <div className="max-w-xl space-y-6">

            <h1 className="text-2xl font-semibold">
                Neues Inventar Item
            </h1>

            <form action={createInventoryItem} className="space-y-4">

                <input
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="description"
                    placeholder="Beschreibung"
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded"
                >
                    Speichern
                </button>

            </form>

        </div>
    )
}